package com.project.base.services;

import com.project.base.dto.*;
import com.project.base.pojo.User;

public interface AuthService {
    AuthResponseDto authenticate(AuthRequestDto request);

    // kept for backward compatibility — old generic registration
    void register(User user);

    void registerBuyer(BuyerRegisterDto dto);
    void registerSeller(SellerRegisterDto dto);
}