package com.smartcourier.trackingservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TrackingEventRequest {
    @NotBlank
    private String trackingNumber;
    
    @NotBlank
    private String status;
    
    @NotBlank
    private String location;
    
    @NotBlank
    private String description;
}
