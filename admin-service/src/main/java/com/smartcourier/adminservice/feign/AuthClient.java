package com.smartcourier.adminservice.feign;

import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(name = "auth-service")
public interface AuthClient {
}
