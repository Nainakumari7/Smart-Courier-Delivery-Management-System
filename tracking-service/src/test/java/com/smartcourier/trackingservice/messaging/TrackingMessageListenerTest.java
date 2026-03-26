package com.smartcourier.trackingservice.messaging;

import com.smartcourier.trackingservice.dto.DeliveryEventDTO;
import com.smartcourier.trackingservice.service.TrackingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.mockito.Mockito.*;

public class TrackingMessageListenerTest {

    @Mock
    private TrackingService trackingService;

    @InjectMocks
    private TrackingMessageListener trackingMessageListener;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testHandleDeliveryEvent() {
        DeliveryEventDTO eventDTO = new DeliveryEventDTO();
        eventDTO.setTrackingNumber("TRK-123");
        eventDTO.setStatus("IN_TRANSIT");

        trackingMessageListener.handleDeliveryEvent(eventDTO);

        verify(trackingService, times(1)).processDeliveryEvent("TRK-123", "IN_TRANSIT", "Delivery status changed to IN_TRANSIT");
    }
}
