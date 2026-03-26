package com.smartcourier.deliveryservice.dto.response;

import com.smartcourier.deliveryservice.entity.Address;
import com.smartcourier.deliveryservice.entity.DeliveryStatus;
import com.smartcourier.deliveryservice.entity.Package;
import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class DeliveryResponseTest {

    @Test
    public void testGettersAndSetters() {
        DeliveryResponse response = new DeliveryResponse();
        Package pkg = new Package();
        Address origin = new Address();
        Address dest = new Address();
        LocalDateTime now = LocalDateTime.now();

        response.setId(1L);
        response.setTrackingNumber("TRK-123");
        response.setUserId(2L);
        response.setPkg(pkg);
        response.setOriginAddress(origin);
        response.setDestinationAddress(dest);
        response.setStatus(DeliveryStatus.PENDING);
        response.setCreatedAt(now);
        response.setUpdatedAt(now);

        assertEquals(1L, response.getId());
        assertEquals("TRK-123", response.getTrackingNumber());
        assertEquals(2L, response.getUserId());
        assertEquals(pkg, response.getPkg());
        assertEquals(origin, response.getOriginAddress());
        assertEquals(dest, response.getDestinationAddress());
        assertEquals(DeliveryStatus.PENDING, response.getStatus());
        assertEquals(now, response.getCreatedAt());
        assertEquals(now, response.getUpdatedAt());

        response.toString();
        response.hashCode();
        assertEquals(response, response);
    }
}
