package com.smartcourier.trackingservice.controller;

import com.smartcourier.trackingservice.dto.TrackingResponse;
import com.smartcourier.trackingservice.service.TrackingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class TrackingControllerTest {

    @Mock
    private TrackingService trackingService;

    @InjectMocks
    private TrackingController trackingController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetTrackingHistory() {
        TrackingResponse tr1 = new TrackingResponse();
        TrackingResponse tr2 = new TrackingResponse();
        when(trackingService.getTrackingHistory("TRK-123")).thenReturn(Arrays.asList(tr1, tr2));

        ResponseEntity<List<TrackingResponse>> response = trackingController.getTrackingHistory("TRK-123");

        assertEquals(200, response.getStatusCode().value());
        assertEquals(2, response.getBody().size());
        verify(trackingService, times(1)).getTrackingHistory("TRK-123");
    }
}
