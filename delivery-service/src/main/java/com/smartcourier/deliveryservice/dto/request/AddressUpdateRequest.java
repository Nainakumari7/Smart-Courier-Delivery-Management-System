package com.smartcourier.deliveryservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddressUpdateRequest {
    @NotBlank
    private String newDestinationAddress;
}
