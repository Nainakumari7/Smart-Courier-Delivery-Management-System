package com.smartcourier.deliveryservice.entity;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class OutboxEventTest {

    @Test
    public void testOutboxEventCreation() {
        OutboxEvent event = OutboxEvent.builder()
                .id(1L)
                .aggregateId("123")
                .eventType("test.event")
                .payload("{}")
                .status(OutboxEvent.OutboxStatus.PENDING)
                .build();

        assertEquals(1L, event.getId());
        assertEquals("123", event.getAggregateId());
        assertEquals("test.event", event.getEventType());
        assertEquals("{}", event.getPayload());
        assertEquals(OutboxEvent.OutboxStatus.PENDING, event.getStatus());
    }

    @Test
    public void testPrePersist() {
        OutboxEvent event = new OutboxEvent();
        event.onCreate();
        
        assertNotNull(event.getCreatedAt());
        assertEquals(OutboxEvent.OutboxStatus.PENDING, event.getStatus());
    }
}
