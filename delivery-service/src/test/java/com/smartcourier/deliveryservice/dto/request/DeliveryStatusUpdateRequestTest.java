package com.smartcourier.deliveryservice.dto.request;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class DeliveryStatusUpdateRequestTest {

    @Test
    public void testGettersAndSetters() {
        DeliveryStatusUpdateRequest request = new DeliveryStatusUpdateRequest();
        request.setStatus("IN_TRANSIT");

        assertEquals("IN_TRANSIT", request.getStatus());

        request.toString();
        request.hashCode();
        assertEquals(request, request);
    }
}
