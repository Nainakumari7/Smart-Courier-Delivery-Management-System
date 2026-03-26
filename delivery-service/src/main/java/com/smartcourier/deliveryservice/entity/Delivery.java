package com.smartcourier.deliveryservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String trackingNumber;

    private Long userId; // The customer who created the delivery

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "package_id")
    private Package pkg;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "origin_address_id")
    private Address originAddress;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "dest_address_id")
    private Address destinationAddress;

    @Enumerated(EnumType.STRING)
    private DeliveryStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private Long agentId; // The agent assigned to handle this delivery
    private LocalDateTime estimatedDeliveryTime;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = DeliveryStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
