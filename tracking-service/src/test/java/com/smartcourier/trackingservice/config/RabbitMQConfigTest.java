package com.smartcourier.trackingservice.config;

import org.junit.jupiter.api.Test;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class RabbitMQConfigTest {

    @Test
    public void testRabbitMQBeans() {
        RabbitMQConfig config = new RabbitMQConfig();
        
        Queue queue = config.queue();
        assertNotNull(queue);
        assertEquals(RabbitMQConfig.QUEUE_NAME, queue.getName());
        
        TopicExchange exchange = config.exchange();
        assertNotNull(exchange);
        assertEquals(RabbitMQConfig.EXCHANGE_NAME, exchange.getName());
        
        Binding binding = config.binding(queue, exchange);
        assertNotNull(binding);
        assertEquals("delivery.routing.key.#", binding.getRoutingKey());
        
        assertNotNull(config.jsonMessageConverter());
    }
}
