package com.smartcourier.deliveryservice.service;

import com.smartcourier.deliveryservice.config.RabbitMQConfig;
import com.smartcourier.deliveryservice.dto.request.DeliveryRequest;
import com.smartcourier.deliveryservice.dto.request.DeliveryStatusUpdateRequest;
import com.smartcourier.deliveryservice.dto.response.DeliveryResponse;
import com.smartcourier.deliveryservice.entity.Delivery;
import com.smartcourier.deliveryservice.entity.DeliveryStatus;
import com.smartcourier.deliveryservice.repository.DeliveryRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DeliveryServiceImpl implements DeliveryService {

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Override
    @Transactional
    public DeliveryResponse createDelivery(DeliveryRequest request) {
        Delivery delivery = new Delivery();
        
        // Generate unique tracking number
        String trackingNumber = "TRK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        delivery.setTrackingNumber(trackingNumber);
        
        delivery.setUserId(request.getUserId());
        delivery.setPkg(request.getPkg());
        delivery.setOriginAddress(request.getOriginAddress());
        delivery.setDestinationAddress(request.getDestinationAddress());
        delivery.setStatus(DeliveryStatus.PENDING);
        
        Delivery savedDelivery = deliveryRepository.save(delivery);
        DeliveryResponse response = mapToResponse(savedDelivery);
        
        // Publish event to RabbitMQ
        publishDeliveryEvent("delivery.created", response);
        
        return response;
    }

    @Override
    public DeliveryResponse getDeliveryById(Long id) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found with id: " + id));
        return mapToResponse(delivery);
    }

    @Override
    public DeliveryResponse getDeliveryByTrackingNumber(String trackingNumber) {
        Delivery delivery = deliveryRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new RuntimeException("Delivery not found with tracking number: " + trackingNumber));
        return mapToResponse(delivery);
    }

    @Override
    public List<DeliveryResponse> getUserDeliveries(Long userId) {
        List<Delivery> deliveries = deliveryRepository.findByUserId(userId);
        return deliveries.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DeliveryResponse updateDeliveryStatus(Long id, DeliveryStatusUpdateRequest request) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found with id: " + id));
        
        try {
            DeliveryStatus newStatus = DeliveryStatus.valueOf(request.getStatus().toUpperCase());
            delivery.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid delivery status: " + request.getStatus());
        }
        
        Delivery updatedDelivery = deliveryRepository.save(delivery);
        DeliveryResponse response = mapToResponse(updatedDelivery);
        
        // Publish event to RabbitMQ
        publishDeliveryEvent("delivery.updated", response);
        
        return response;
    }

    @Override
    @Transactional
    public DeliveryResponse cancelDelivery(Long id) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found with id: " + id));
        
        if (delivery.getStatus() == DeliveryStatus.DELIVERED) {
            throw new RuntimeException("Cannot cancel a delivered item.");
        }
        
        delivery.setStatus(DeliveryStatus.CANCELLED);
        Delivery updatedDelivery = deliveryRepository.save(delivery);
        DeliveryResponse response = mapToResponse(updatedDelivery);
        
        publishDeliveryEvent("delivery.cancelled", response);
        return response;
    }

    @Override
    @Transactional
    public DeliveryResponse updateDeliveryAddress(Long id, com.smartcourier.deliveryservice.dto.request.AddressUpdateRequest request) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found with id: " + id));
        
        if (delivery.getStatus() != DeliveryStatus.PENDING) {
            throw new RuntimeException("Address can only be updated for PENDING deliveries.");
        }
        
        // Basic update - in a real app, update the Address entity fields
        delivery.getDestinationAddress().setStreet(request.getNewDestinationAddress());
        
        Delivery updatedDelivery = deliveryRepository.save(delivery);
        DeliveryResponse response = mapToResponse(updatedDelivery);
        
        publishDeliveryEvent("delivery.address_updated", response);
        return response;
    }

    @Override
    @Transactional
    public DeliveryResponse estimateDeliveryTime(Long id) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found with id: " + id));
        
        // Simple mock estimation logic: +2 days from now
        delivery.setEstimatedDeliveryTime(LocalDateTime.now().plusDays(2));
        
        Delivery updatedDelivery = deliveryRepository.save(delivery);
        return mapToResponse(updatedDelivery);
    }

    @Override
    @Transactional
    public DeliveryResponse assignAgent(Long id, com.smartcourier.deliveryservice.dto.request.AgentAssignmentRequest request) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found with id: " + id));
        
        delivery.setAgentId(request.getAgentId());
        delivery.setStatus(DeliveryStatus.ASSIGNED);
        
        Delivery updatedDelivery = deliveryRepository.save(delivery);
        DeliveryResponse response = mapToResponse(updatedDelivery);
        
        publishDeliveryEvent("delivery.assigned", response);
        return response;
    }

    @Override
    @Transactional
    public void deleteDelivery(Long id) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found with id: " + id));
        deliveryRepository.delete(delivery);
    }

    private DeliveryResponse mapToResponse(Delivery delivery) {
        DeliveryResponse response = new DeliveryResponse();
        response.setId(delivery.getId());
        response.setTrackingNumber(delivery.getTrackingNumber());
        response.setUserId(delivery.getUserId());
        response.setPkg(delivery.getPkg());
        response.setOriginAddress(delivery.getOriginAddress());
        response.setDestinationAddress(delivery.getDestinationAddress());
        response.setStatus(delivery.getStatus());
        response.setCreatedAt(delivery.getCreatedAt());
        response.setUpdatedAt(delivery.getUpdatedAt());
        response.setAgentId(delivery.getAgentId());
        response.setEstimatedDeliveryTime(delivery.getEstimatedDeliveryTime());
        return response;
    }

    private void publishDeliveryEvent(String routingKeySuffix, DeliveryResponse response) {
        String routingKey = "delivery.routing.key." + routingKeySuffix;
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, routingKey, response);
    }
}
