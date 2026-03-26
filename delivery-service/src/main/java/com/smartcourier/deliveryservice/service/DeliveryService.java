package com.smartcourier.deliveryservice.service;

import com.smartcourier.deliveryservice.dto.request.DeliveryRequest;
import com.smartcourier.deliveryservice.dto.request.DeliveryStatusUpdateRequest;
import com.smartcourier.deliveryservice.dto.response.DeliveryResponse;

import java.util.List;

public interface DeliveryService {
    DeliveryResponse createDelivery(DeliveryRequest request);
    DeliveryResponse getDeliveryById(Long id);
    DeliveryResponse getDeliveryByTrackingNumber(String trackingNumber);
    List<DeliveryResponse> getUserDeliveries(Long userId);
    DeliveryResponse updateDeliveryStatus(Long id, DeliveryStatusUpdateRequest request);
    DeliveryResponse cancelDelivery(Long id);
    DeliveryResponse updateDeliveryAddress(Long id, com.smartcourier.deliveryservice.dto.request.AddressUpdateRequest request);
    DeliveryResponse estimateDeliveryTime(Long id);
    DeliveryResponse assignAgent(Long id, com.smartcourier.deliveryservice.dto.request.AgentAssignmentRequest request);
    void deleteDelivery(Long id);
}
