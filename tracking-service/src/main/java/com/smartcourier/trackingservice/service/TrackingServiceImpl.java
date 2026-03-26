package com.smartcourier.trackingservice.service;

import com.smartcourier.trackingservice.dto.TrackingResponse;
import com.smartcourier.trackingservice.entity.TrackingEvent;
import com.smartcourier.trackingservice.repository.TrackingEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrackingServiceImpl implements TrackingService {

    @Autowired
    private TrackingEventRepository trackingEventRepository;

    @Override
    public void processDeliveryEvent(String trackingNumber, String status, String description) {
        TrackingEvent event = new TrackingEvent();
        event.setTrackingNumber(trackingNumber);
        event.setStatus(status);
        event.setDescription(description);
        // Location could be extracted or enriched, setting to System for now
        event.setLocation("System update");
        
        trackingEventRepository.save(event);
    }

    @Override
    public void addTrackingEvent(com.smartcourier.trackingservice.dto.TrackingEventRequest request) {
        TrackingEvent event = new TrackingEvent();
        event.setTrackingNumber(request.getTrackingNumber());
        event.setStatus(request.getStatus());
        event.setLocation(request.getLocation());
        event.setDescription(request.getDescription());
        trackingEventRepository.save(event);
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

    private TrackingResponse mapToResponse(TrackingEvent event) {
        return new TrackingResponse(
                event.getTrackingNumber(),
                event.getStatus(),
                event.getLocation(),
                event.getDescription(),
                event.getEventTime()
        );
    }
}
