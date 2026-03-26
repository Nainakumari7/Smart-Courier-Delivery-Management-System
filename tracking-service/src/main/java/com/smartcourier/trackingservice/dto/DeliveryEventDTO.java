package com.smartcourier.trackingservice.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DeliveryEventDTO {
    private Long id;
    private String trackingNumber;
    private Long userId;
    private Object pkg;
    private Object originAddress;
    private Object destinationAddress;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
