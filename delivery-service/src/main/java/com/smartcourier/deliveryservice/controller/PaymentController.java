package com.smartcourier.deliveryservice.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.smartcourier.deliveryservice.dto.PaymentOrderRequest;
import com.smartcourier.deliveryservice.dto.PaymentVerificationRequest;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payments")
public class PaymentController {


    @Autowired
    private RazorpayClient razorpayClient;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody PaymentOrderRequest request) {
        try {
            JSONObject orderRequest = new JSONObject();
            // Razorpay expects amount in paise (1 INR = 100 paise)
            orderRequest.put("amount", (int) (request.getAmount() * 100));
            orderRequest.put("currency", request.getCurrency());
            orderRequest.put("receipt", request.getReceipt());

            Order order = razorpayClient.orders.create(orderRequest);
            return ResponseEntity.ok(order.toString());
        } catch (RazorpayException e) {
            return ResponseEntity.status(500).body("Error creating Razorpay order: " + e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        try {
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", request.getRazorpayOrderId());
            attributes.put("razorpay_payment_id", request.getRazorpayPaymentId());
            attributes.put("razorpay_signature", request.getRazorpaySignature());

            boolean isValid = Utils.verifyPaymentSignature(attributes, keySecret);
            
            if (isValid) {
                return ResponseEntity.ok(Map.of("status", "success", "message", "Payment verified successfully"));
            } else {
                return ResponseEntity.status(400).body(Map.of("status", "failed", "message", "Invalid payment signature"));
            }
        } catch (RazorpayException e) {
            return ResponseEntity.status(500).body("Error verifying payment: " + e.getMessage());
        }
    }
}
