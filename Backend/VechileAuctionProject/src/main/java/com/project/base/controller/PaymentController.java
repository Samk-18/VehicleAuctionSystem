package com.project.base.controller;

import com.project.base.dto.ApiResponse;
import com.project.base.dto.PaymentVerifyDto;
import com.project.base.pojo.Payment;
import com.project.base.pojo.PaymentFor;
import com.project.base.security.MyUserDetails;
import com.project.base.services.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

   
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(
            @RequestParam Double amount,
            @RequestParam PaymentFor paymentFor,
            @RequestParam Long referenceId,
            @AuthenticationPrincipal MyUserDetails user
    ) {
        try {
            Payment payment = paymentService.createOrder(
                    amount,
                    user.getUser().getId(),
                    paymentFor,
                    referenceId
            );
            return ResponseEntity.ok(payment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse("Payment gateway error. Please try again."));
        }
    }

   
    @PostMapping("/razorpay/verify")
    public ResponseEntity<String> verifyPayment(
            @Valid @RequestBody PaymentVerifyDto dto
    ) {
       
        paymentService.verifyPayment(
                dto.getRazorpayOrderId(),
                dto.getRazorpayPaymentId(),
                dto.getRazorpaySignature()
        );

        return ResponseEntity.ok("Payment verified and plan assigned successfully");
    }
}
