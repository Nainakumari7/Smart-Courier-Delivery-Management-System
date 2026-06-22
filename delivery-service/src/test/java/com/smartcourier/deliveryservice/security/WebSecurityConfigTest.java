package com.smartcourier.deliveryservice.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@ActiveProfiles("test")
public class WebSecurityConfigTest {

    @Autowired
    private WebSecurityConfig webSecurityConfig;

    @Autowired
    private SecurityFilterChain securityFilterChain;

    @Test
    public void contextLoads() {
        assertNotNull(webSecurityConfig);
        assertNotNull(securityFilterChain);
    }
}
