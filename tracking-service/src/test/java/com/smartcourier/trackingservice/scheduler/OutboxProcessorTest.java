package com.smartcourier.trackingservice.scheduler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcourier.trackingservice.entity.OutboxEvent;
import com.smartcourier.trackingservice.repository.OutboxEventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.util.Arrays;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class OutboxProcessorTest {

    @Mock
    private OutboxEventRepository outboxEventRepository;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private OutboxProcessor outboxProcessor;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testProcessOutboxEvents_Success() {
        OutboxEvent event = OutboxEvent.builder()
                .id(1L)
                .aggregateId("TRK-123")
                .eventType("tracking.updated")
                .payload("{\"status\":\"IN_TRANSIT\"}")
                .status(OutboxEvent.OutboxStatus.PENDING)
                .build();

        when(outboxEventRepository.findByStatus(OutboxEvent.OutboxStatus.PENDING))
                .thenReturn(Arrays.asList(event));

        outboxProcessor.processOutboxEvents();

        verify(rabbitTemplate, times(1)).convertAndSend(eq("delivery.exchange"), eq("tracking.updated"), eq("{\"status\":\"IN_TRANSIT\"}"));
        
        ArgumentCaptor<OutboxEvent> captor = ArgumentCaptor.forClass(OutboxEvent.class);
        verify(outboxEventRepository, times(1)).save(captor.capture());
        assertEquals(OutboxEvent.OutboxStatus.PROCESSED, captor.getValue().getStatus());
    }

    @Test
    public void testProcessOutboxEvents_Empty() {
        when(outboxEventRepository.findByStatus(OutboxEvent.OutboxStatus.PENDING))
                .thenReturn(Collections.emptyList());

        outboxProcessor.processOutboxEvents();

        verify(rabbitTemplate, never()).convertAndSend(anyString(), anyString(), anyString());
    }

    @Test
    public void testProcessOutboxEvents_Failure() {
        OutboxEvent event = OutboxEvent.builder()
                .id(1L)
                .aggregateId("TRK-123")
                .eventType("tracking.updated")
                .payload("{\"status\":\"IN_TRANSIT\"}")
                .status(OutboxEvent.OutboxStatus.PENDING)
                .build();

        when(outboxEventRepository.findByStatus(OutboxEvent.OutboxStatus.PENDING))
                .thenReturn(Arrays.asList(event));
        
        doThrow(new RuntimeException("RabbitMQ Down")).when(rabbitTemplate)
                .convertAndSend(anyString(), anyString(), anyString());

        outboxProcessor.processOutboxEvents();

        // Should be set to FAILED
        ArgumentCaptor<OutboxEvent> captor = ArgumentCaptor.forClass(OutboxEvent.class);
        verify(outboxEventRepository, times(1)).save(captor.capture());
        assertEquals(OutboxEvent.OutboxStatus.FAILED, captor.getValue().getStatus());
    }
}
