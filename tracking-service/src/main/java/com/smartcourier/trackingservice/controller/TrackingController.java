package com.smartcourier.trackingservice.controller;

import com.smartcourier.trackingservice.dto.TrackingResponse;
import com.smartcourier.trackingservice.service.TrackingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tracking")
public class TrackingController {
    
    @Autowired
    private TrackingService trackingService;
    
    @GetMapping("/{trackingNumber}")
    public ResponseEntity<List<TrackingResponse>> getTrackingHistory(@PathVariable("trackingNumber") String trackingNumber) {
        return ResponseEntity.ok(trackingService.getTrackingHistory(trackingNumber));
    }

    @GetMapping("/{trackingNumber}/latest")
    public ResponseEntity<TrackingResponse> getLatestTrackingStatus(@PathVariable("trackingNumber") String trackingNumber) {
        return ResponseEntity.ok(trackingService.getLatestTrackingStatus(trackingNumber));
    }

    @PostMapping("/events")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> addTrackingEvent(@Valid @RequestBody com.smartcourier.trackingservice.dto.TrackingEventRequest request) {
        trackingService.addTrackingEvent(request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTrackingEvent(@PathVariable("id") Long id) {
        trackingService.deleteTrackingEvent(id);
        return ResponseEntity.noContent().build();
    }
}
