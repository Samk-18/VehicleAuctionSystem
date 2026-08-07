package com.project.base.services;

public interface EmailService {
    void sendOtpEmail(String toEmail, String otpCode, String purposeLabel);
}