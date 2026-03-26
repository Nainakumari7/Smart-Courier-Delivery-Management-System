package com.smartcourier.adminservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class AdminServiceApplicationTest {

    @Test
    void contextLoads() {
        // Context loads successfully
    }

    @Test
    void main() {
        AdminServiceApplication.main(new String[] {"--server.port=0", "--spring.profiles.active=test"});
    }
}
