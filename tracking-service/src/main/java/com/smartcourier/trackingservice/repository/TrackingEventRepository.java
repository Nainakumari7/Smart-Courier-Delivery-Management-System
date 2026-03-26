package com.smartcourier.trackingservice.repository;

import com.smartcourier.trackingservice.entity.TrackingEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrackingEventRepository extends JpaRepository<TrackingEvent, Long> {
    List<TrackingEvent> findByTrackingNumberOrderByEventTimeDesc(String trackingNumber);
}
