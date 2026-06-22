package com.smartcourier.deliveryservice.config;

import org.junit.jupiter.api.Test;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@ActiveProfiles("test")
public class RabbitMQConfigTest {

    @Autowired
    private RabbitMQConfig rabbitMQConfig;

    @Autowired
    private Queue queue;

    @Autowired
    private TopicExchange exchange;

    @Autowired
    private Binding binding;

    @Autowired
    private MessageConverter messageConverter;

    @Test
    public void testRabbitMQConfigBeans() {
        assertNotNull(rabbitMQConfig);
        assertNotNull(queue);
        assertNotNull(exchange);
        assertNotNull(binding);
        assertNotNull(messageConverter);
    }
}
