package com.smartcourier.deliveryservice.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.smartcourier.deliveryservice.repository.OutboxEventRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcourier.deliveryservice.entity.OutboxEvent;

import com.smartcourier.deliveryservice.dto.request.DeliveryRequest;
import com.smartcourier.deliveryservice.dto.request.DeliveryStatusUpdateRequest;
import com.smartcourier.deliveryservice.dto.response.DeliveryResponse;
import com.smartcourier.deliveryservice.entity.Address;
import com.smartcourier.deliveryservice.entity.Delivery;
import com.smartcourier.deliveryservice.entity.DeliveryStatus;
import com.smartcourier.deliveryservice.entity.Package;
import com.smartcourier.deliveryservice.repository.DeliveryRepository;

public class DeliveryServiceImplTest {

    @Mock
    private DeliveryRepository deliveryRepository;

    @Mock
    private OutboxEventRepository outboxEventRepository;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private DeliveryServiceImpl deliveryService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateDelivery() {
        DeliveryRequest request = new DeliveryRequest();
        request.setUserId(1L);
        request.setPkg(new Package(1L, "Test package", 2.0, 100.0, 200.0, 10.0, 10.0, 10.0));
        request.setOriginAddress(new Address(1L, "123 Main St", "City", "State", "12345", "Country"));
        request.setDestinationAddress(new Address(2L, "456 Main St", "City", "State", "12345", "Country"));

        Delivery savedDelivery = new Delivery();
        savedDelivery.setId(1L);
        savedDelivery.setTrackingNumber("TRK-12345678");
        savedDelivery.setUserId(1L);
        savedDelivery.setStatus(DeliveryStatus.PENDING);
        savedDelivery.setCreatedAt(LocalDateTime.now());
        savedDelivery.setUpdatedAt(LocalDateTime.now());

        when(deliveryRepository.save(any(Delivery.class))).thenReturn(savedDelivery);

        DeliveryResponse response = deliveryService.createDelivery(request);

        assertNotNull(response);
        assertEquals(DeliveryStatus.PENDING, response.getStatus());
        assertEquals("TRK-12345678", response.getTrackingNumber());
        
        verify(outboxEventRepository, times(1)).save(any(OutboxEvent.class));
    }

    @Test
    public void testUpdateDeliveryStatus() {
        Delivery delivery = new Delivery();
        delivery.setId(1L);
        delivery.setStatus(DeliveryStatus.PENDING);
        delivery.setTrackingNumber("TRK-12345678");

        when(deliveryRepository.findById(1L)).thenReturn(Optional.of(delivery));
        when(deliveryRepository.save(any(Delivery.class))).thenReturn(delivery);

        DeliveryStatusUpdateRequest updateRequest = new DeliveryStatusUpdateRequest();
        updateRequest.setStatus("IN_TRANSIT");

        DeliveryResponse response = deliveryService.updateDeliveryStatus(1L, updateRequest);

        assertNotNull(response);
        assertEquals(DeliveryStatus.IN_TRANSIT, response.getStatus());

        verify(outboxEventRepository, times(1)).save(any(OutboxEvent.class));
    }

    @Test
    public void testGetDeliveryById() {
        Delivery delivery = new Delivery();
        delivery.setId(1L);
        delivery.setTrackingNumber("TRK-123");
        when(deliveryRepository.findById(1L)).thenReturn(Optional.of(delivery));

        DeliveryResponse response = deliveryService.getDeliveryById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("TRK-123", response.getTrackingNumber());
    }

    @Test
    public void testGetDeliveryByTrackingNumber() {
        Delivery delivery = new Delivery();
        delivery.setId(1L);
        delivery.setTrackingNumber("TRK-123");
        when(deliveryRepository.findByTrackingNumber("TRK-123")).thenReturn(Optional.of(delivery));

        DeliveryResponse response = deliveryService.getDeliveryByTrackingNumber("TRK-123");

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("TRK-123", response.getTrackingNumber());
    }

    @Test
    public void testGetUserDeliveries() {
        Delivery delivery = new Delivery();
        delivery.setId(1L);
        delivery.setUserId(99L);
        when(deliveryRepository.findByUserId(99L)).thenReturn(java.util.Arrays.asList(delivery));

        java.util.List<DeliveryResponse> responseList = deliveryService.getUserDeliveries(99L);

        assertEquals(1, responseList.size());
        assertEquals(99L, responseList.get(0).getUserId());
    }

    @Test
    public void testCancelDelivery_Success() {
        Delivery delivery = new Delivery();
        delivery.setId(1L);
        delivery.setStatus(DeliveryStatus.PENDING);
        when(deliveryRepository.findById(1L)).thenReturn(Optional.of(delivery));
        when(deliveryRepository.save(any(Delivery.class))).thenReturn(delivery);

        DeliveryResponse response = deliveryService.cancelDelivery(1L);

        assertEquals(DeliveryStatus.CANCELLED, response.getStatus());
        verify(outboxEventRepository, times(1)).save(any(OutboxEvent.class));
    }

    @Test
    public void testCancelDelivery_AlreadyDelivered() {
        Delivery delivery = new Delivery();
        delivery.setId(1L);
        delivery.setStatus(DeliveryStatus.DELIVERED);
        when(deliveryRepository.findById(1L)).thenReturn(Optional.of(delivery));

        org.junit.jupiter.api.Assertions.assertThrows(RuntimeException.class, () -> {
            deliveryService.cancelDelivery(1L);
        });
    }

    @Test
    public void testUpdateDeliveryAddress_Success() {
        Delivery delivery = new Delivery();
        delivery.setId(1L);
        delivery.setStatus(DeliveryStatus.PENDING);
        delivery.setDestinationAddress(new Address());
        when(deliveryRepository.findById(1L)).thenReturn(Optional.of(delivery));
        when(deliveryRepository.save(any(Delivery.class))).thenReturn(delivery);

        com.smartcourier.deliveryservice.dto.request.AddressUpdateRequest request = new com.smartcourier.deliveryservice.dto.request.AddressUpdateRequest();
        request.setNewDestinationAddress("New Address");

        DeliveryResponse response = deliveryService.updateDeliveryAddress(1L, request);

        assertNotNull(response);
        verify(deliveryRepository, times(1)).save(delivery);
    }

    @Test
    public void testUpdateDeliveryAddress_NotPending() {
        Delivery delivery = new Delivery();
        delivery.setId(1L);
        delivery.setStatus(DeliveryStatus.IN_TRANSIT);
        when(deliveryRepository.findById(1L)).thenReturn(Optional.of(delivery));

        com.smartcourier.deliveryservice.dto.request.AddressUpdateRequest request = new com.smartcourier.deliveryservice.dto.request.AddressUpdateRequest();

        org.junit.jupiter.api.Assertions.assertThrows(RuntimeException.class, () -> {
            deliveryService.updateDeliveryAddress(1L, request);
        });
    }

    @Test
    public void testEstimateDeliveryTime() {
        Delivery delivery = new Delivery();
        delivery.setId(1L);
        when(deliveryRepository.findById(1L)).thenReturn(Optional.of(delivery));
        when(deliveryRepository.save(any(Delivery.class))).thenReturn(delivery);

        DeliveryResponse response = deliveryService.estimateDeliveryTime(1L);

        assertNotNull(response.getEstimatedDeliveryTime());
    }

    @Test
    public void testAssignAgent() {
        Delivery delivery = new Delivery();
        delivery.setId(1L);
        when(deliveryRepository.findById(1L)).thenReturn(Optional.of(delivery));
        when(deliveryRepository.save(any(Delivery.class))).thenReturn(delivery);

        com.smartcourier.deliveryservice.dto.request.AgentAssignmentRequest request = new com.smartcourier.deliveryservice.dto.request.AgentAssignmentRequest();
        request.setAgentId(42L);

        DeliveryResponse response = deliveryService.assignAgent(1L, request);

        assertEquals(42L, response.getAgentId());
        assertEquals(DeliveryStatus.ASSIGNED, response.getStatus());
    }

    @Test
    public void testSearchDeliveries() {
        when(deliveryRepository.searchDeliveries(anyString(), any())).thenReturn(java.util.Collections.emptyList());
        java.util.List<DeliveryResponse> results = deliveryService.searchDeliveries("test", "PENDING");
        assertNotNull(results);
    }

    @Test
    public void testSearchDeliveries_InvalidStatus() {
        org.junit.jupiter.api.Assertions.assertThrows(RuntimeException.class, () -> {
            deliveryService.searchDeliveries("test", "INVALID_STATUS");
        });
    }

    @Test
    public void testUpdateDeliveryStatus_InvalidStatus() {
        Delivery delivery = new Delivery();
        delivery.setId(1L);
        when(deliveryRepository.findById(1L)).thenReturn(Optional.of(delivery));
        
        DeliveryStatusUpdateRequest updateRequest = new DeliveryStatusUpdateRequest();
        updateRequest.setStatus("INVALID_STATUS");

        org.junit.jupiter.api.Assertions.assertThrows(RuntimeException.class, () -> {
            deliveryService.updateDeliveryStatus(1L, updateRequest);
        });
    }

    @Test
    public void testGetDeliveryById_NotFound() {
        when(deliveryRepository.findById(1L)).thenReturn(Optional.empty());
        org.junit.jupiter.api.Assertions.assertThrows(RuntimeException.class, () -> {
            deliveryService.getDeliveryById(1L);
        });
    }

    @Test
    public void testDeleteDelivery() {
        Delivery delivery = new Delivery();
        delivery.setId(1L);
        when(deliveryRepository.findById(1L)).thenReturn(Optional.of(delivery));

        deliveryService.deleteDelivery(1L);

        verify(deliveryRepository, times(1)).delete(delivery);
    }
}
