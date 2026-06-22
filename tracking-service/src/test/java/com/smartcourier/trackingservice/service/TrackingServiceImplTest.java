package com.smartcourier.trackingservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcourier.trackingservice.dto.TrackingResponse;
import com.smartcourier.trackingservice.entity.TrackingEvent;
import com.smartcourier.trackingservice.repository.OutboxEventRepository;
import com.smartcourier.trackingservice.repository.TrackingEventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class TrackingServiceImplTest {

    @Mock
    private TrackingEventRepository trackingEventRepository;

    @Mock
    private OutboxEventRepository outboxEventRepository;

    @Mock
    private ObjectMapper objectMapper;

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
        verify(outboxEventRepository, times(1)).save(any());
    }

    @Test
    public void testAddTrackingEvent() {
        com.smartcourier.trackingservice.dto.TrackingEventRequest request = new com.smartcourier.trackingservice.dto.TrackingEventRequest();
        request.setTrackingNumber("TRK-123");
        request.setStatus("IN_TRANSIT");
        request.setLocation("Warehouse A");
        request.setDescription("Package arrived at warehouse");

        when(trackingEventRepository.save(any(TrackingEvent.class))).thenReturn(new TrackingEvent());

        trackingService.addTrackingEvent(request);

        verify(trackingEventRepository, times(1)).save(any(TrackingEvent.class));
        verify(outboxEventRepository, times(1)).save(any());
    }

    @Test
    public void testGetLatestTrackingStatus() {
        TrackingEvent event = new TrackingEvent(1L, "TRK-123", "IN_TRANSIT", "Warehouse A", "System", LocalDateTime.now());
        when(trackingEventRepository.findByTrackingNumberOrderByEventTimeDesc("TRK-123")).thenReturn(Arrays.asList(event));

        TrackingResponse response = trackingService.getLatestTrackingStatus("TRK-123");

        assertEquals("TRK-123", response.getTrackingNumber());
        assertEquals("IN_TRANSIT", response.getStatus());
    }

    @Test
    public void testGetLatestTrackingStatusNotFound() {
        when(trackingEventRepository.findByTrackingNumberOrderByEventTimeDesc("TRK-ABSENT")).thenReturn(Arrays.asList());
        assertThrows(RuntimeException.class, () -> {
            trackingService.getLatestTrackingStatus("TRK-ABSENT");
        });
    }

    @Test
    public void testDeleteTrackingEvent_Success() {
        TrackingEvent event = new TrackingEvent(1L, "TRK-123", "IN_TRANSIT", "System", "In transit", LocalDateTime.now());
        when(trackingEventRepository.findById(1L)).thenReturn(Optional.of(event));
        
        trackingService.deleteTrackingEvent(1L);
        
        verify(trackingEventRepository, times(1)).deleteById(1L);
        verify(outboxEventRepository, times(1)).save(any());
    }

    @Test
    public void testDeleteTrackingEvent_NotFound() {
        when(trackingEventRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> {
            trackingService.deleteTrackingEvent(99L);
        });
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

        assertThrows(RuntimeException.class, () -> {
            trackingService.getTrackingHistory("TRK-NONEXISTENT");
        });
    }
}
