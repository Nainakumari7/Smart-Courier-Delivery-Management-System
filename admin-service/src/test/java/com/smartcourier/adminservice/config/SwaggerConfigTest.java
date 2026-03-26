package com.smartcourier.adminservice.config;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import io.swagger.v3.oas.models.OpenAPI;

public class SwaggerConfigTest {
    @Test
    public void testOpenApi() {
        SwaggerConfig config = new SwaggerConfig();
        OpenAPI api = config.customOpenAPI();
        assertNotNull(api);
        assertNotNull(api.getComponents());
        assertNotNull(api.getComponents().getSecuritySchemes().get("bearer-jwt"));
    }
}
