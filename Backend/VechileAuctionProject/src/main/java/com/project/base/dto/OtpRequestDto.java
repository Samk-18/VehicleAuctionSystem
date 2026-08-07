package com.project.base.dto;

import com.project.base.pojo.OtpPurpose;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OtpRequestDto {

    @NotBlank
    @Email
    private String email;

    @NotNull
    private OtpPurpose purpose;
}
