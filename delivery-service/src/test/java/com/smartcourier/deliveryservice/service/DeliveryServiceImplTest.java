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
import org.springframework.amqp.rabbit.core.RabbitTemplate;

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
    private RabbitTemplate rabbitTemplate;

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
        request.setPkg(new Package(1L, "Test package", 2.0, 10.0, 10.0, 10.0));
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
        
        verify(rabbitTemplate, times(1)).convertAndSend(anyString(), anyString(), any(Object.class));
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

        verify(rabbitTemplate, times(1)).convertAndSend(anyString(), anyString(), any(Object.class));
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
    public void testDeleteDelivery() {
        Delivery delivery = new Delivery();
        delivery.setId(1L);
        when(deliveryRepository.findById(1L)).thenReturn(Optional.of(delivery));

        deliveryService.deleteDelivery(1L);

        verify(deliveryRepository, times(1)).delete(delivery);
    }
}
