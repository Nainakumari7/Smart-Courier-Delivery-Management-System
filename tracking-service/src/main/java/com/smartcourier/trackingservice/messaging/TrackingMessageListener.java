package com.smartcourier.trackingservice.messaging;

import com.smartcourier.trackingservice.config.RabbitMQConfig;
import com.smartcourier.trackingservice.dto.DeliveryEventDTO;
import com.smartcourier.trackingservice.service.TrackingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TrackingMessageListener {

    private static final Logger logger = LoggerFactory.getLogger(TrackingMessageListener.class);

    @Autowired
    private TrackingService trackingService;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void handleDeliveryEvent(DeliveryEventDTO eventDTO) {
        logger.info("Received delivery event for tracking number {}: context {}", 
                eventDTO.getTrackingNumber(), eventDTO.getStatus());
        
        String description = "Delivery status changed to " + eventDTO.getStatus();
        trackingService.processDeliveryEvent(eventDTO.getTrackingNumber(), eventDTO.getStatus(), description);
    }
}
