package com.project.base.services.impl;

import com.project.base.pojo.OtpPurpose;
import com.project.base.pojo.OtpVerification;
import com.project.base.repository.OtpVerificationRepository;
import com.project.base.services.EmailService;
import com.project.base.services.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class OtpServiceImpl implements OtpService {

    @Autowired
    private OtpVerificationRepository otpRepo;

    @Autowired
    private EmailService emailService;

    private static final SecureRandom RANDOM = new SecureRandom();

    @Override
    @Transactional
    public void generateAndSendOtp(String email, OtpPurpose purpose) {
        String otp = String.valueOf(100000 + RANDOM.nextInt(900000)); // 6-digit code

        OtpVerification record = new OtpVerification();
        record.setEmail(email.trim().toLowerCase());
        record.setOtpCode(otp);
        record.setPurpose(purpose);
        record.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        record.setVerified(false);

        otpRepo.save(record);

        String label = purpose == OtpPurpose.REGISTRATION ? "account registration" : "password reset";
        emailService.sendOtpEmail(email, otp, label);
    }

    @Override
    @Transactional
    public void verifyOtp(String email, String otpCode, OtpPurpose purpose) {
        OtpVerification record = otpRepo
                .findTopByEmailAndPurposeOrderByCreatedOnDesc(email.trim().toLowerCase(), purpose)
                .orElseThrow(() -> new RuntimeException("No OTP request found for this email. Please request a new code."));

        if (record.isVerified()) {
            throw new RuntimeException("This OTP has already been used. Please request a new code.");
        }
        if (LocalDateTime.now().isAfter(record.getExpiresAt())) {
            throw new RuntimeException("OTP has expired. Please request a new code.");
        }
        if (!record.getOtpCode().equals(otpCode.trim())) {
            throw new RuntimeException("Incorrect OTP. Please check and try again.");
        }

        record.setVerified(true);
        otpRepo.save(record);
    }
}