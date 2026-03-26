package com.smartcourier.trackingservice.dto;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class TrackingResponseTest {

    @Test
    public void testGettersAndSetters() {
        TrackingResponse response = new TrackingResponse();
        
        LocalDateTime now = LocalDateTime.now();
        response.setTrackingNumber("TRK-123");
        response.setStatus("DELIVERED");
        response.setLocation("NY");
        response.setDescription("Arrived");
        response.setEventTime(now);
        
        assertEquals("TRK-123", response.getTrackingNumber());
        assertEquals("DELIVERED", response.getStatus());
        assertEquals("NY", response.getLocation());
        assertEquals("Arrived", response.getDescription());
        assertEquals(now, response.getEventTime());
        
        response.toString();
        response.hashCode();
        assertEquals(response, response);
    }
}
