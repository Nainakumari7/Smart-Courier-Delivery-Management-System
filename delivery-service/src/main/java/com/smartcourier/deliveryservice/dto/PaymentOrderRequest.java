package com.smartcourier.deliveryservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentOrderRequest {
    private Double amount;
    private String currency;
    private String receipt;
}
