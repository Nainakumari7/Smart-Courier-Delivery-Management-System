package com.smartcourier.deliveryservice.scheduler;

import com.smartcourier.deliveryservice.entity.OutboxEvent;
import com.smartcourier.deliveryservice.repository.OutboxEventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

public class OutboxProcessorTest {

    @Mock
    private OutboxEventRepository outboxEventRepository;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private OutboxProcessor outboxProcessor;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testProcessOutboxEvents_NoPendingEvents() {
        when(outboxEventRepository.findByStatus(OutboxEvent.OutboxStatus.PENDING)).thenReturn(Collections.emptyList());

        outboxProcessor.processOutboxEvents();

        verify(rabbitTemplate, never()).convertAndSend(anyString(), anyString(), any(Object.class));
        verify(outboxEventRepository, never()).save(any(OutboxEvent.class));
    }

    @Test
    public void testProcessOutboxEvents_Success() {
        OutboxEvent event = OutboxEvent.builder()
                .id(1L)
                .aggregateId("1")
                .eventType("delivery.created")
                .payload("{\"id\":1}")
                .status(OutboxEvent.OutboxStatus.PENDING)
                .build();

        when(outboxEventRepository.findByStatus(OutboxEvent.OutboxStatus.PENDING)).thenReturn(List.of(event));

        outboxProcessor.processOutboxEvents();

        verify(rabbitTemplate, times(1)).convertAndSend(anyString(), anyString(), any(Object.class));
        verify(outboxEventRepository, times(1)).save(argThat(e -> e.getStatus() == OutboxEvent.OutboxStatus.PROCESSED));
    }

    @Test
    public void testProcessOutboxEvents_Failure() {
        OutboxEvent event = OutboxEvent.builder()
                .id(1L)
                .aggregateId("1")
                .eventType("delivery.created")
                .payload("{\"id\":1}")
                .status(OutboxEvent.OutboxStatus.PENDING)
                .build();

        when(outboxEventRepository.findByStatus(OutboxEvent.OutboxStatus.PENDING)).thenReturn(List.of(event));
        doThrow(new RuntimeException("RabbitMQ Down")).when(rabbitTemplate).convertAndSend(anyString(), anyString(), any(Object.class));

        outboxProcessor.processOutboxEvents();

        // Should not update status if failed
        verify(outboxEventRepository, never()).save(argThat(e -> e.getStatus() == OutboxEvent.OutboxStatus.PROCESSED));
    }
}
