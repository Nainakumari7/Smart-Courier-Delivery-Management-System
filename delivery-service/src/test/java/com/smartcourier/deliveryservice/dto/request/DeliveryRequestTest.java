package com.smartcourier.deliveryservice.dto.request;

import com.smartcourier.deliveryservice.entity.Address;
import com.smartcourier.deliveryservice.entity.Package;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class DeliveryRequestTest {

    @Test
    public void testGettersAndSetters() {
        DeliveryRequest request = new DeliveryRequest();
        Package pkg = new Package();
        Address origin = new Address();
        Address dest = new Address();

        request.setUserId(1L);
        request.setPkg(pkg);
        request.setOriginAddress(origin);
        request.setDestinationAddress(dest);

        assertEquals(1L, request.getUserId());
        assertEquals(pkg, request.getPkg());
        assertEquals(origin, request.getOriginAddress());
        assertEquals(dest, request.getDestinationAddress());

        request.toString();
        request.hashCode();
        assertEquals(request, request);
    }
}
