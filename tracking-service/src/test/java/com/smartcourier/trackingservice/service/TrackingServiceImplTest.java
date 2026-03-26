package com.smartcourier.trackingservice.service;

import com.smartcourier.trackingservice.dto.TrackingResponse;
import com.smartcourier.trackingservice.entity.TrackingEvent;
import com.smartcourier.trackingservice.repository.TrackingEventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;

public class TrackingServiceImplTest {

    @Mock
    private TrackingEventRepository trackingEventRepository;

    @InjectMocks
    private TrackingServiceImpl trackingService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testProcessDeliveryEvent() {
        when(trackingEventRepository.save(any(TrackingEvent.class))).thenReturn(new TrackingEvent());

        trackingService.processDeliveryEvent("TRK-123", "IN_TRANSIT", "Package is in transit");

        verify(trackingEventRepository, times(1)).save(any(TrackingEvent.class));
    }

    @Test
    public void testGetTrackingHistory() {
        TrackingEvent event1 = new TrackingEvent(1L, "TRK-123", "IN_TRANSIT", "System", "In transit", LocalDateTime.now());
        TrackingEvent event2 = new TrackingEvent(2L, "TRK-123", "PENDING", "System", "Pending", LocalDateTime.now().minusHours(1));

        when(trackingEventRepository.findByTrackingNumberOrderByEventTimeDesc("TRK-123"))
                .thenReturn(Arrays.asList(event1, event2));

        List<TrackingResponse> history = trackingService.getTrackingHistory("TRK-123");

        assertEquals(2, history.size());
        assertEquals("IN_TRANSIT", history.get(0).getStatus());
        assertEquals("PENDING", history.get(1).getStatus());
    }

    @Test
    public void testGetTrackingHistoryNotFound() {
        when(trackingEventRepository.findByTrackingNumberOrderByEventTimeDesc("TRK-NONEXISTENT"))
                .thenReturn(Arrays.asList());

        try {
            trackingService.getTrackingHistory("TRK-NONEXISTENT");
        } catch (RuntimeException e) {
            assertEquals("No tracking history found for tracking number: TRK-NONEXISTENT", e.getMessage());
        }
    }
}
