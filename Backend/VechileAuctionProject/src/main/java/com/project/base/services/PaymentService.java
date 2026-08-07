package com.project.base.services;

import com.project.base.pojo.Payment;
import com.project.base.pojo.PaymentFor;

public interface PaymentService {

    Payment createOrder(Double amount, Long userId,
                        PaymentFor paymentFor, Long referenceId) throws Exception;

    void verifyPayment(String orderId,
                       String paymentId,
                       String signature) ;
}

