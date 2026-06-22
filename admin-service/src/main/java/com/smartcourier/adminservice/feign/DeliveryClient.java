package com.smartcourier.adminservice.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "delivery-service")
public interface DeliveryClient {

    @GetMapping("/deliveries/tracking/{trackingNumber}")
    Object getDeliveryByTrackingNumber(@RequestHeader("Authorization") String token, @PathVariable("trackingNumber") String trackingNumber);

    @GetMapping("/deliveries/{id}")
    Object getDeliveryById(@RequestHeader("Authorization") String token, @PathVariable("id") Long id);

    @GetMapping("/deliveries/search")
    java.util.List<Object> getAllDeliveries(@RequestHeader("Authorization") String token);

    @DeleteMapping("/deliveries/all")
    void deleteAllDeliveries(@RequestHeader("Authorization") String token);
}
