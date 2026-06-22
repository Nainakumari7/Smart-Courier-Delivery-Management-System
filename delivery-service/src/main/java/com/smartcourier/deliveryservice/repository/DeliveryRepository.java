package com.smartcourier.deliveryservice.repository;

import com.smartcourier.deliveryservice.entity.Delivery;
import com.smartcourier.deliveryservice.entity.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    Optional<Delivery> findByTrackingNumber(String trackingNumber);
    List<Delivery> findByUserId(Long userId);
    List<Delivery> findByStatus(DeliveryStatus status);

    @org.springframework.data.jpa.repository.Query("SELECT d FROM Delivery d WHERE " +
            "(:status IS NULL OR d.status = :status) AND " +
            "(LOWER(d.trackingNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(d.pkg.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Delivery> searchDeliveries(@org.springframework.data.repository.query.Param("query") String query, 
                                    @org.springframework.data.repository.query.Param("status") DeliveryStatus status);
}
