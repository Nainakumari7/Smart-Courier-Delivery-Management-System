package com.smartcourier.trackingservice.dto;

import com.smartcourier.trackingservice.entity.TrackingEvent;
import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

class CoverageTest {

    @Test
    void testTrackingEvent() {
        LocalDateTime now = LocalDateTime.now();
        TrackingEvent event = new TrackingEvent(1L, "TRK123", "PENDING", "Origin", "Description", now);
        
        assertEquals(1L, event.getId());
        assertEquals("TRK123", event.getTrackingNumber());
        assertEquals("PENDING", event.getStatus());
        assertEquals("Origin", event.getLocation());
        assertEquals("Description", event.getDescription());
        assertEquals(now, event.getEventTime());

        event.setTrackingNumber("TRK456");
        assertEquals("TRK456", event.getTrackingNumber());
        
        TrackingEvent event2 = new TrackingEvent(1L, "TRK456", "PENDING", "Origin", "Description", now);
        assertEquals(event, event2);
        assertEquals(event.hashCode(), event2.hashCode());
        assertNotNull(event.toString());

        assertNotEquals(event, new TrackingEvent());
    }

    @Test
    void testTrackingEventRequest() {
        TrackingEventRequest request = new TrackingEventRequest();
        request.setTrackingNumber("TRK123");
        request.setStatus("DELIVERED");
        request.setLocation("HUB");
        request.setDescription("Arrived");

        assertEquals("TRK123", request.getTrackingNumber());
        assertEquals("DELIVERED", request.getStatus());
        assertEquals("HUB", request.getLocation());
        assertEquals("Arrived", request.getDescription());
        
        TrackingEventRequest request2 = new TrackingEventRequest();
        request2.setTrackingNumber("TRK123");
        request2.setStatus("DELIVERED");
        request2.setLocation("HUB");
        request2.setDescription("Arrived");
        
        assertEquals(request, request2);
        assertEquals(request.hashCode(), request2.hashCode());
        assertNotNull(request.toString());
        assertTrue(request.canEqual(request2));
    }

    @Test
    void testTrackingResponse() {
        LocalDateTime now = LocalDateTime.now();
        TrackingResponse response = new TrackingResponse("TRK123", "PENDING", "Origin", "Desc", now);
        
        assertEquals("TRK123", response.getTrackingNumber());
        assertEquals("PENDING", response.getStatus());
        assertEquals("Origin", response.getLocation());
        assertEquals("Desc", response.getDescription());
        assertEquals(now, response.getEventTime());

        response.setTrackingNumber("TRK456");
        assertEquals("TRK456", response.getTrackingNumber());

        TrackingResponse response2 = new TrackingResponse("TRK456", "PENDING", "Origin", "Desc", now);
        assertEquals(response, response2);
        assertEquals(response.hashCode(), response2.hashCode());
        assertNotNull(response.toString());
        assertTrue(response.canEqual(response2));
    }
}
