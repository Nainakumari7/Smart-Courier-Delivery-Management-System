package com.smartcourier.trackingservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "tracking_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrackingEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String trackingNumber;

    @Column(nullable = false)
    private String status;

    private String location; 

    private String description;

    private LocalDateTime eventTime;

    @PrePersist
    protected void onCreate() {
        if (eventTime == null) {
            eventTime = LocalDateTime.now();
        }
    }
}
