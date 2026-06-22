package com.smartcourier.trackingservice.scheduler;

import com.smartcourier.trackingservice.config.RabbitMQConfig;
import com.smartcourier.trackingservice.entity.OutboxEvent;
import com.smartcourier.trackingservice.repository.OutboxEventRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@Slf4j
public class OutboxProcessor {

    @Autowired
    private OutboxEventRepository outboxEventRepository;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Scheduled(fixedDelay = 5000) // Poll every 5 seconds
    @Transactional
    public void processOutboxEvents() {
        List<OutboxEvent> pendingEvents = outboxEventRepository.findByStatus(OutboxEvent.OutboxStatus.PENDING);
        
        if (pendingEvents.isEmpty()) {
            return;
        }

        log.info("Processing {} pending outbox events", pendingEvents.size());

        for (OutboxEvent event : pendingEvents) {
            try {
                // Publish to RabbitMQ
                rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, event.getEventType(), event.getPayload());
                
                // Update status to PROCESSED
                event.setStatus(OutboxEvent.OutboxStatus.PROCESSED);
                event.setProcessedAt(LocalDateTime.now());
                outboxEventRepository.save(event);
                
                log.info("Successfully processed outbox event: {}", event.getId());
            } catch (Exception e) {
                log.error("Failed to process outbox event: {}. Error: {}", event.getId(), e.getMessage());
                event.setStatus(OutboxEvent.OutboxStatus.FAILED);
                outboxEventRepository.save(event);
            }
        }
    }
}
