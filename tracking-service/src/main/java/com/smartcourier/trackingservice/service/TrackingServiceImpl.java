package com.smartcourier.trackingservice.service;

import com.smartcourier.trackingservice.dto.TrackingResponse;
import com.smartcourier.trackingservice.entity.TrackingEvent;
import com.smartcourier.trackingservice.repository.TrackingEventRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcourier.trackingservice.entity.OutboxEvent;
import com.smartcourier.trackingservice.repository.OutboxEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrackingServiceImpl implements TrackingService {

    @Autowired
    private TrackingEventRepository trackingEventRepository;

    @Autowired
    private OutboxEventRepository outboxEventRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    @Transactional
    public void processDeliveryEvent(String trackingNumber, String status, String description) {
        TrackingEvent event = new TrackingEvent();
        event.setTrackingNumber(trackingNumber);
        event.setStatus(status);
        event.setDescription(description);
        // Location could be extracted or enriched, setting to System for now
        event.setLocation("System update");
        
        TrackingEvent savedEvent = trackingEventRepository.save(event);
        publishTrackingEvent("tracking.updated", mapToResponse(savedEvent));
    }

    @Override
    @Transactional
    public void addTrackingEvent(com.smartcourier.trackingservice.dto.TrackingEventRequest request) {
        TrackingEvent event = new TrackingEvent();
        event.setTrackingNumber(request.getTrackingNumber());
        event.setStatus(request.getStatus());
        event.setLocation(request.getLocation());
        event.setDescription(request.getDescription());
        
        TrackingEvent savedEvent = trackingEventRepository.save(event);
        publishTrackingEvent("tracking.added", mapToResponse(savedEvent));
    }

    @Override
    public List<TrackingResponse> getTrackingHistory(String trackingNumber) {
        List<TrackingEvent> events = trackingEventRepository.findByTrackingNumberOrderByEventTimeDesc(trackingNumber);
        if (events.isEmpty()) {
            throw new RuntimeException("No tracking history found for tracking number: " + trackingNumber);
        }
        
        return events.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public TrackingResponse getLatestTrackingStatus(String trackingNumber) {
        List<TrackingEvent> events = trackingEventRepository.findByTrackingNumberOrderByEventTimeDesc(trackingNumber);
        if (events.isEmpty()) {
            throw new RuntimeException("No tracking history found for tracking number: " + trackingNumber);
        }
        return mapToResponse(events.get(0));
    }

    @Override
    @Transactional
    public void deleteTrackingEvent(Long id) {
        TrackingEvent event = trackingEventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tracking event not found with id: " + id));
        
        trackingEventRepository.deleteById(id);
        publishTrackingEvent("tracking.deleted", mapToResponse(event));
    }

    private TrackingResponse mapToResponse(TrackingEvent event) {
        return new TrackingResponse(
                event.getTrackingNumber(),
                event.getStatus(),
                event.getLocation(),
                event.getDescription(),
                event.getEventTime()
        );
    }

    private void publishTrackingEvent(String routingKeySuffix, TrackingResponse response) {
        try {
            String routingKey = "delivery.routing.key." + routingKeySuffix;
            String payload = objectMapper.writeValueAsString(response);
            
            OutboxEvent event = OutboxEvent.builder()
                    .aggregateId(response.getTrackingNumber())
                    .eventType(routingKey)
                    .payload(payload)
                    .status(OutboxEvent.OutboxStatus.PENDING)
                    .build();
            
            outboxEventRepository.save(event);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializing tracking event: " + e.getMessage());
        }
    }
}
