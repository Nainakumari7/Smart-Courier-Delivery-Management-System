package com.smartcourier.deliveryservice.config;

import io.swagger.v3.oas.models.OpenAPI;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@ActiveProfiles("test")
public class SwaggerConfigTest {

    @Autowired
    private SwaggerConfig swaggerConfig;

    @Autowired
    private OpenAPI openAPI;

    @Test
    public void testSwaggerConfigBeans() {
        assertNotNull(swaggerConfig);
        assertNotNull(openAPI);
    }
}
