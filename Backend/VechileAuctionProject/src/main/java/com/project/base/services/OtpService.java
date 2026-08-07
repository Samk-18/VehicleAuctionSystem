package com.project.base.services;

import com.project.base.pojo.OtpPurpose;

public interface OtpService {
    void generateAndSendOtp(String email, OtpPurpose purpose);
    void verifyOtp(String email, String otpCode, OtpPurpose purpose);
}