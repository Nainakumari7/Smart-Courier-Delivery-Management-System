package com.smartcourier.deliveryservice.entity;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

public class DeliveryEntityTests {

    @Test
    public void testAddress() {
        Address address = new Address(1L, "Street", "City", "State", "Zip", "Country");
        assertEquals(1L, address.getId());
        assertEquals("Street", address.getStreet());
        assertEquals("City", address.getCity());
        assertEquals("State", address.getState());
        assertEquals("Zip", address.getZipCode());
        assertEquals("Country", address.getCountry());
        
        Address empty = new Address();
        empty.setId(2L);
        assertEquals(2L, empty.getId());
        
        empty.toString();
        empty.hashCode();
        assertEquals(empty, empty);
    }

    @Test
    public void testPackage() {
        Package pkg = new Package(1L, "Desc", 10.0, 5.0, 5.0, 5.0);
        assertEquals(1L, pkg.getId());
        assertEquals("Desc", pkg.getDescription());
        assertEquals(10.0, pkg.getWeight());
        assertEquals(5.0, pkg.getLength());
        assertEquals(5.0, pkg.getWidth());
        assertEquals(5.0, pkg.getHeight());
        
        Package empty = new Package();
        empty.setId(2L);
        assertEquals(2L, empty.getId());
        
        empty.toString();
        empty.hashCode();
        assertEquals(empty, empty);
    }

    @Test
    public void testDelivery() {
        LocalDateTime now = LocalDateTime.now();
        Package pkg = new Package();
        Address origin = new Address();
        Address dest = new Address();

        Delivery d = new Delivery(1L, "TRK-1", 2L, pkg, origin, dest, DeliveryStatus.PENDING, now, now, null, null);
        assertEquals(1L, d.getId());
        assertEquals("TRK-1", d.getTrackingNumber());
        assertEquals(2L, d.getUserId());
        assertEquals(pkg, d.getPkg());
        assertEquals(origin, d.getOriginAddress());
        assertEquals(dest, d.getDestinationAddress());
        assertEquals(DeliveryStatus.PENDING, d.getStatus());
        assertEquals(now, d.getCreatedAt());
        assertEquals(now, d.getUpdatedAt());

        Delivery empty = new Delivery();
        empty.setId(2L);
        assertEquals(2L, empty.getId());
        
        empty.toString();
        empty.hashCode();
        assertEquals(empty, empty);
    }

    @Test
    public void testDeliveryCallbacks() {
        Delivery d = new Delivery();
        d.onCreate();
        assertNotNull(d.getCreatedAt());
        assertNotNull(d.getUpdatedAt());
        assertEquals(DeliveryStatus.PENDING, d.getStatus());
        
        d.onUpdate();
        assertNotNull(d.getUpdatedAt());
    }
}
