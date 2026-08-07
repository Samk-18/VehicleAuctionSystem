package com.project.base.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import com.project.base.pojo.SellerType;

@Getter
@Setter
public class SellerRegisterDto {

    @NotBlank private String firstName;
    @NotBlank private String lastName;
    @NotBlank private String otp;
    @Email @NotBlank private String email;

    @NotBlank private String password;
    @NotBlank private String confirmPassword;

    @NotBlank private String phone;

    @NotBlank private String houseStreet;
    @NotBlank private String city;
    @NotBlank private String state;
    @NotBlank private String pincode;

    @NotBlank private String idProofNumber;       // Aadhaar or PAN
    @NotBlank private String drivingLicenseNumber;

    private SellerType sellerType = SellerType.INDIVIDUAL;
    private String dealerName;

    @AssertTrue(message = "You must accept the Terms & Conditions")
    private boolean agreeTerms;

    @AssertTrue(message = "You must accept the Privacy Policy")
    private boolean agreePrivacy;
}