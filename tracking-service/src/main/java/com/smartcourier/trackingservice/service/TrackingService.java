package com.smartcourier.trackingservice.service;

import com.smartcourier.trackingservice.dto.TrackingResponse;
import com.smartcourier.trackingservice.entity.TrackingEvent;

import java.util.List;

public interface TrackingService {
    void processDeliveryEvent(String trackingNumber, String status, String description);
    void addTrackingEvent(com.smartcourier.trackingservice.dto.TrackingEventRequest request);
    List<TrackingResponse> getTrackingHistory(String trackingNumber);
    TrackingResponse getLatestTrackingStatus(String trackingNumber);
}
