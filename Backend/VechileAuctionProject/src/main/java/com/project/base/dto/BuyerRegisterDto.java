package com.project.base.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BuyerRegisterDto {

    @NotBlank private String firstName;
    @NotBlank private String lastName;
    @NotBlank private String otp;
    @Email @NotBlank private String email;

    @NotBlank private String password;
    @NotBlank private String confirmPassword;

    @NotBlank private String phone;

    // optional address block
    private String city;
    private String state;
    private String pincode;

    @AssertTrue(message = "You must accept the Terms & Conditions")
    private boolean agreeTerms;

    @AssertTrue(message = "You must accept the Privacy Policy")
    private boolean agreePrivacy;
}