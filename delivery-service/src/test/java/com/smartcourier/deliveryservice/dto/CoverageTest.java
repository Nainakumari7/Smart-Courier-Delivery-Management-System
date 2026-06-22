package com.smartcourier.deliveryservice.dto;

import com.smartcourier.deliveryservice.dto.request.DeliveryRequest;
import com.smartcourier.deliveryservice.dto.response.DeliveryResponse;
import com.smartcourier.deliveryservice.entity.OutboxEvent;
import com.smartcourier.deliveryservice.entity.OutboxEvent.OutboxStatus;
import com.smartcourier.deliveryservice.entity.Package;
import com.smartcourier.deliveryservice.entity.Address;
import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

class CoverageTest {

    @Test
    void testDeliveryRequest() {
        DeliveryRequest request = new DeliveryRequest();
        request.setUserId(1L);
        Package pkg = new Package();
        request.setPkg(pkg);
        Address origin = new Address();
        request.setOriginAddress(origin);
        Address dest = new Address();
        request.setDestinationAddress(dest);

        assertEquals(1L, request.getUserId());
        assertEquals(pkg, request.getPkg());
        assertEquals(origin, request.getOriginAddress());
        assertEquals(dest, request.getDestinationAddress());
        
        DeliveryRequest request2 = new DeliveryRequest();
        request2.setUserId(1L);
        request2.setPkg(pkg);
        request2.setOriginAddress(origin);
        request2.setDestinationAddress(dest);
        
        assertEquals(request, request2);
        assertEquals(request.hashCode(), request2.hashCode());
        assertNotNull(request.toString());
    }

    @Test
    void testDeliveryResponse() {
        LocalDateTime now = LocalDateTime.now();
        DeliveryResponse response = new DeliveryResponse();
        response.setId(1L);
        response.setTrackingNumber("TRK123");
        response.setUserId(2L);
        response.setCreatedAt(now);
        response.setUpdatedAt(now);
        
        assertEquals(1L, response.getId());
        assertEquals("TRK123", response.getTrackingNumber());
        assertEquals(2L, response.getUserId());
        assertEquals(now, response.getCreatedAt());
        assertEquals(now, response.getUpdatedAt());

        response.setTrackingNumber("TRK456");
        assertEquals("TRK456", response.getTrackingNumber());
        
        DeliveryResponse response2 = new DeliveryResponse();
        response2.setId(1L);
        response2.setTrackingNumber("TRK456");
        response2.setUserId(2L);
        response2.setCreatedAt(now);
        response2.setUpdatedAt(now);

        assertEquals(response, response2);
        assertEquals(response.hashCode(), response2.hashCode());
        assertNotNull(response.toString());
    }

    @Test
    void testOutboxEvent() {
        LocalDateTime now = LocalDateTime.now();
        OutboxEvent event = new OutboxEvent(1L, "AGGR", "TYPE", "payload", OutboxStatus.PENDING, now, now);
        
        assertEquals(1L, event.getId());
        assertEquals("AGGR", event.getAggregateId());
        assertEquals("TYPE", event.getEventType());
        assertEquals("payload", event.getPayload());
        assertEquals(OutboxStatus.PENDING, event.getStatus());
        assertEquals(now, event.getCreatedAt());

        event.setStatus(OutboxStatus.PROCESSED);
        assertEquals(OutboxStatus.PROCESSED, event.getStatus());
        
        OutboxEvent event2 = new OutboxEvent(1L, "AGGR", "TYPE", "payload", OutboxStatus.PROCESSED, now, now);
        assertEquals(event, event2);
        assertEquals(event.hashCode(), event2.hashCode());
        assertNotNull(event.toString());
    }
}
