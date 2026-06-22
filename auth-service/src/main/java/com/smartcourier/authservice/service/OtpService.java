package com.smartcourier.authservice.service;

import com.smartcourier.authservice.entity.Otp;
import com.smartcourier.authservice.repository.OtpRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private OtpRepository otpRepository;

    private static final int OTP_EXPIRATION_MINUTES = 10;

    @Transactional
    public String generateAndSaveOtp(String email) {
        // Delete any existing OTP for this email
        otpRepository.deleteByEmail(email);

        // Generate 6-digit OTP
        String otpCode = String.format("%06d", new Random().nextInt(999999));

        Otp otp = new Otp();
        otp.setEmail(email);
        otp.setOtpCode(otpCode);
        otp.setExpiryDate(LocalDateTime.now().plusMinutes(OTP_EXPIRATION_MINUTES));

        otpRepository.save(otp);
        
        System.out.println("==================================================");
        System.out.println("GENERATED OTP FOR " + email + " : " + otpCode);
        System.out.println("==================================================");
        
        return otpCode;
    }

    public boolean validateOtp(String email, String otpCode) {
        Optional<Otp> otpOptional = otpRepository.findByEmailAndOtpCode(email, otpCode);

        if (otpOptional.isPresent()) {
            Otp otp = otpOptional.get();
            if (!otp.isExpired()) {
                return true;
            }
        }
        return false;
    }

    @Transactional
    public void deleteOtp(String email) {
        otpRepository.deleteByEmail(email);
    }
}
