package com.smartcourier.deliveryservice.controller;

import com.smartcourier.deliveryservice.dto.request.DeliveryRequest;
import com.smartcourier.deliveryservice.dto.request.DeliveryStatusUpdateRequest;
import com.smartcourier.deliveryservice.dto.response.DeliveryResponse;
import com.smartcourier.deliveryservice.service.DeliveryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/deliveries")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;


    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<DeliveryResponse> createDelivery(@Valid @RequestBody DeliveryRequest request) {
        // In a real app, verify request.getUserId() matches the authenticated user
        DeliveryResponse response = deliveryService.createDelivery(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<DeliveryResponse> getDelivery(@PathVariable("id") Long id) {
        return ResponseEntity.ok(deliveryService.getDeliveryById(id));
    }

    @GetMapping("/tracking/{trackingNumber}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<DeliveryResponse> getDeliveryByTrackingNumber(@PathVariable("trackingNumber") String trackingNumber) {
        return ResponseEntity.ok(deliveryService.getDeliveryByTrackingNumber(trackingNumber));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<List<DeliveryResponse>> getUserDeliveries(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(deliveryService.getUserDeliveries(userId));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<DeliveryResponse> updateStatus(@PathVariable("id") Long id, 
                                                        @Valid @RequestBody DeliveryStatusUpdateRequest request) {
        return ResponseEntity.ok(deliveryService.updateDeliveryStatus(id, request));
    }


    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<DeliveryResponse> cancelDelivery(@PathVariable("id") Long id) {
        return ResponseEntity.ok(deliveryService.cancelDelivery(id));
    }

    @PutMapping("/{id}/address")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<DeliveryResponse> updateAddress(@PathVariable("id") Long id, 
                                                         @Valid @RequestBody com.smartcourier.deliveryservice.dto.request.AddressUpdateRequest request) {
        return ResponseEntity.ok(deliveryService.updateDeliveryAddress(id, request));
    }

    @GetMapping("/{id}/estimate")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<DeliveryResponse> estimateTime(@PathVariable("id") Long id) {
        return ResponseEntity.ok(deliveryService.estimateDeliveryTime(id));
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DeliveryResponse> assignAgent(@PathVariable("id") Long id, 
                                                       @Valid @RequestBody com.smartcourier.deliveryservice.dto.request.AgentAssignmentRequest request) {
        return ResponseEntity.ok(deliveryService.assignAgent(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDelivery(@PathVariable("id") Long id) {
        deliveryService.deleteDelivery(id);
        return ResponseEntity.noContent().build();
    }
}
