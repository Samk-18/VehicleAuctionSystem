package com.project.base.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.base.dto.ApiResponse;
import com.project.base.dto.CartResponseDTO;
import com.project.base.services.CartService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    

    @PostMapping("/add/{carId}")
    public ResponseEntity<?> addToCart(@PathVariable Long carId, Authentication auth) {
        try {
            if (auth == null) {
                return ResponseEntity.status(401).body(new ApiResponse("You must be logged in to add items to cart"));
            }
            cartService.addToCart(carId, auth.getName());
            return ResponseEntity.ok(new ApiResponse("Car added to cart"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(new ApiResponse(e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> myCart(Authentication auth) {
        return ResponseEntity.ok(cartService.getMyCart(auth.getName()));
    }
    
    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long cartItemId, Authentication auth) {
        try {
            cartService.removeFromCart(cartItemId, auth.getName());
            return ResponseEntity.ok(new ApiResponse("Item removed from cart"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(new ApiResponse(e.getMessage()));
        }
    }   
}
