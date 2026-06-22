package com.smartcourier.adminservice.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "auth-service")
public interface AuthClient {
    @GetMapping("/auth/users/{id}")
    Object getUserById(@RequestHeader("Authorization") String token, @PathVariable("id") Long id);

    @PutMapping("/auth/users/{id}/block")
    Object blockUser(@RequestHeader("Authorization") String token, @PathVariable("id") Long id);

    @PutMapping("/auth/users/{id}/unblock")
    Object unblockUser(@RequestHeader("Authorization") String token, @PathVariable("id") Long id);

    @GetMapping("/auth/users")
    java.util.List<Object> getAllUsers(@RequestHeader("Authorization") String token);

    @DeleteMapping("/auth/users/all")
    void deleteAllUsers(@RequestHeader("Authorization") String token);
}
