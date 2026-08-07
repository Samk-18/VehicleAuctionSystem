package com.project.base.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponseDto {

    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String token;    
    private String message;
}
