package com.smartcourier.trackingservice.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.web.SecurityFilterChain;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class WebSecurityConfigTest {

    @Autowired
    private WebSecurityConfig webSecurityConfig;

    @Test
    public void testFilterChainBean() {
        assertNotNull(webSecurityConfig.authenticationJwtTokenFilter());
    }
}
