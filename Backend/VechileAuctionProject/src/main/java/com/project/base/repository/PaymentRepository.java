package com.project.base.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.base.pojo.Payment;
import com.project.base.pojo.User;

public interface PaymentRepository extends JpaRepository<Payment, Long>{
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

    boolean existsByUserId(Long userId);

}
