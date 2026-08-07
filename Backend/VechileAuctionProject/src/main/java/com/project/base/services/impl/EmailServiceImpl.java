package com.project.base.services.impl;

import com.project.base.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendOtpEmail(String toEmail, String otpCode, String purposeLabel) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("AuctionMart — Your Verification Code");
        message.setText(
            "Your OTP for " + purposeLabel + " is: " + otpCode +
            "\n\nThis code expires in 10 minutes. If you didn't request this, you can ignore this email."
        );
        mailSender.send(message);
    }
}