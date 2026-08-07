package com.project.base.services;

import com.project.base.dto.ApiResponse;

public interface CartService {
	public ApiResponse addToCart(Long carId, String email) ;

	public Object getMyCart(String name);
	public ApiResponse removeFromCart(Long cartItemId, String email);

}
