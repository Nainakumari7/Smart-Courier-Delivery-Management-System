package com.smartcourier.adminservice.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "delivery-service")
public interface DeliveryClient {

    @GetMapping("/deliveries/{id}")
    Object getDeliveryById(@PathVariable("id") Long id, @RequestHeader("Authorization") String token);
}
