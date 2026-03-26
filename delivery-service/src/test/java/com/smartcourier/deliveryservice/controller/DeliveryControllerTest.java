package com.smartcourier.deliveryservice.controller;

import com.smartcourier.deliveryservice.dto.request.DeliveryRequest;
import com.smartcourier.deliveryservice.dto.request.DeliveryStatusUpdateRequest;
import com.smartcourier.deliveryservice.dto.response.DeliveryResponse;
import com.smartcourier.deliveryservice.service.DeliveryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

public class DeliveryControllerTest {

    @Mock
    private DeliveryService deliveryService;

    @InjectMocks
    private DeliveryController deliveryController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateDelivery() {
        DeliveryRequest request = new DeliveryRequest();
        DeliveryResponse responseDTO = new DeliveryResponse();
        when(deliveryService.createDelivery(any(DeliveryRequest.class))).thenReturn(responseDTO);

        ResponseEntity<DeliveryResponse> response = deliveryController.createDelivery(request);

        assertEquals(201, response.getStatusCode().value());
        verify(deliveryService, times(1)).createDelivery(any(DeliveryRequest.class));
    }

    @Test
    public void testGetDelivery() {
        DeliveryResponse responseDTO = new DeliveryResponse();
        when(deliveryService.getDeliveryById(anyLong())).thenReturn(responseDTO);

        ResponseEntity<DeliveryResponse> response = deliveryController.getDelivery(1L);

        assertEquals(200, response.getStatusCode().value());
        verify(deliveryService, times(1)).getDeliveryById(1L);
    }

    @Test
    public void testGetDeliveryByTrackingNumber() {
        DeliveryResponse responseDTO = new DeliveryResponse();
        when(deliveryService.getDeliveryByTrackingNumber(anyString())).thenReturn(responseDTO);

        ResponseEntity<DeliveryResponse> response = deliveryController.getDeliveryByTrackingNumber("TRK-123");

        assertEquals(200, response.getStatusCode().value());
        verify(deliveryService, times(1)).getDeliveryByTrackingNumber("TRK-123");
    }

    @Test
    public void testGetUserDeliveries() {
        DeliveryResponse responseDTO = new DeliveryResponse();
        when(deliveryService.getUserDeliveries(anyLong())).thenReturn(Arrays.asList(responseDTO));

        ResponseEntity<List<DeliveryResponse>> response = deliveryController.getUserDeliveries(1L);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
        verify(deliveryService, times(1)).getUserDeliveries(1L);
    }

    @Test
    public void testUpdateStatus() {
        DeliveryStatusUpdateRequest updateRequest = new DeliveryStatusUpdateRequest();
        updateRequest.setStatus("DELIVERED");
        DeliveryResponse responseDTO = new DeliveryResponse();
        when(deliveryService.updateDeliveryStatus(anyLong(), any(DeliveryStatusUpdateRequest.class))).thenReturn(responseDTO);

        ResponseEntity<DeliveryResponse> response = deliveryController.updateStatus(1L, updateRequest);

        assertEquals(200, response.getStatusCode().value());
        verify(deliveryService, times(1)).updateDeliveryStatus(1L, updateRequest);
    }

    @Test
    public void testDeleteDelivery() {
        doNothing().when(deliveryService).deleteDelivery(anyLong());

        ResponseEntity<Void> response = deliveryController.deleteDelivery(1L);

        assertEquals(204, response.getStatusCode().value());
        verify(deliveryService, times(1)).deleteDelivery(1L);
    }
}
