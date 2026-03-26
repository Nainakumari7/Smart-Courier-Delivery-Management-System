package com.smartcourier.deliveryservice.dto.response;

import com.smartcourier.deliveryservice.entity.Address;
import com.smartcourier.deliveryservice.entity.DeliveryStatus;
import com.smartcourier.deliveryservice.entity.Package;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DeliveryResponse {
    private Long id;
    private String trackingNumber;
    private Long userId;
    private Package pkg;
    private Address originAddress;
    private Address destinationAddress;
    private DeliveryStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long agentId;
    private LocalDateTime estimatedDeliveryTime;
}
