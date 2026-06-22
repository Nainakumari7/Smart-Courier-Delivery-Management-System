package com.smartcourier.authservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Your SmartCourier Verification Code");
        message.setText("Welcome to SmartCourier! \n\n" +
                "Your registration verification code is: " + otp + "\n\n" +
                "This code will expire in 10 minutes.\n\n" +
                "Thank you,\nThe SmartCourier Team");
        mailSender.send(message);
    }
}
