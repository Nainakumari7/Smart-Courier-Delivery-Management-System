package com.smartcourier.deliveryservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DeliveryStatusUpdateRequest {
    @NotBlank
    private String status;
}
