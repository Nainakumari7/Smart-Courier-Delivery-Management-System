package com.smartcourier.trackingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrackingResponse {
    private String trackingNumber;
    private String status;
    private String location;
    private String description;
    private LocalDateTime eventTime;
}
