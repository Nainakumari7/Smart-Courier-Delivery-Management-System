package com.smartcourier.trackingservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class TrackingServiceApplicationTest {

    @Test
    void contextLoads() {
        // Context loads successfully
    }

    @Test
    void main() {
        TrackingServiceApplication.main(new String[] {"--server.port=0", "--spring.profiles.active=test"});
    }
}
