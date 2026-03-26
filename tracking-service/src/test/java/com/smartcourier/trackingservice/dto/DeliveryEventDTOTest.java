package com.smartcourier.trackingservice.dto;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class DeliveryEventDTOTest {

    @Test
    public void testGettersAndSetters() {
        DeliveryEventDTO dto = new DeliveryEventDTO();
        
        LocalDateTime now = LocalDateTime.now();
        dto.setId(1L);
        dto.setTrackingNumber("TRK-123");
        dto.setUserId(2L);
        dto.setPkg("Box");
        dto.setOriginAddress("NY");
        dto.setDestinationAddress("LA");
        dto.setStatus("PENDING");
        dto.setCreatedAt(now);
        dto.setUpdatedAt(now);
        
        assertEquals(1L, dto.getId());
        assertEquals("TRK-123", dto.getTrackingNumber());
        assertEquals(2L, dto.getUserId());
        assertEquals("Box", dto.getPkg());
        assertEquals("NY", dto.getOriginAddress());
        assertEquals("LA", dto.getDestinationAddress());
        assertEquals("PENDING", dto.getStatus());
        assertEquals(now, dto.getCreatedAt());
        assertEquals(now, dto.getUpdatedAt());
        
        // test toString, equals, hashCode from lombok
        dto.toString();
        dto.hashCode();
        assertEquals(dto, dto);
    }
}
