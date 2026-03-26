package com.smartcourier.trackingservice.entity;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

public class TrackingEventTest {

    @Test
    public void testGettersAndSetters() {
        LocalDateTime now = LocalDateTime.now();
        TrackingEvent event = new TrackingEvent(1L, "TRK-123", "PENDING", "NY", "Started", now);
        
        assertEquals(1L, event.getId());
        assertEquals("TRK-123", event.getTrackingNumber());
        assertEquals("PENDING", event.getStatus());
        assertEquals("NY", event.getLocation());
        assertEquals("Started", event.getDescription());
        assertEquals(now, event.getEventTime());
        
        TrackingEvent eventEmpty = new TrackingEvent();
        eventEmpty.setTrackingNumber("TRK-124");
        assertEquals("TRK-124", eventEmpty.getTrackingNumber());
        
        eventEmpty.toString();
        eventEmpty.hashCode();
        assertEquals(eventEmpty, eventEmpty);
    }
    
    @Test
    public void testPrePersist() {
        TrackingEvent event = new TrackingEvent();
        assertNull(event.getEventTime());
        event.onCreate();
        assertNotNull(event.getEventTime());
    }
}
