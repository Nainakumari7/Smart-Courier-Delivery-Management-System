package com.smartcourier.deliveryservice.dto.request;

import com.smartcourier.deliveryservice.entity.Address;
import com.smartcourier.deliveryservice.entity.Package;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DeliveryRequest {
    @NotNull
    private Long userId;

    @NotNull
    private Package pkg;

    @NotNull
    private Address originAddress;

    @NotNull
    private Address destinationAddress;
}
