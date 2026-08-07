package com.project.base.services.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.base.pojo.*;
import com.project.base.repository.*;
import com.project.base.services.DealService;
import com.project.base.services.PaymentService;
import com.project.base.utils.RazorpaySignatureUtil;
import com.razorpay.RazorpayClient;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import com.razorpay.RazorpayClient;
import com.project.base.dto.ApiResponse;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepo;
    private final UserRepository userRepo;
    private final CartRepository cartRepo;
    private final OrderRepository orderRepo;
    private final SubscriptionPlanRepository planRepo;
    private final UserSubscriptionRepository userSubRepo;
    private final AuctionRepository auctionRepo;
    private final DealRepository dealRepo;
    private final DealService dealService;
    
    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Override
    public Payment createOrder(
            Double amount,
            Long userId,
            PaymentFor paymentFor,
            Long referenceId
    ) throws Exception {

        Double finalAmount = amount;

        if (paymentFor == PaymentFor.DEPOSIT) {
            Deal deal = dealRepo.findById(referenceId)
                    .orElseThrow(() -> new RuntimeException("Deal not found"));

            if (!deal.getBuyer().getId().equals(userId)) {
                throw new RuntimeException("You are not authorized to pay for this deal");
            }
            if (deal.getStatus() != DealStatus.PENDING) {
                throw new RuntimeException("This deal is no longer accepting payment");
            }
            if (LocalDateTime.now().isAfter(deal.getDepositDeadline())) {
                throw new RuntimeException("Deposit deadline has passed");
            }
            if (deal.isDepositPaid()) {
                throw new RuntimeException("Deposit has already been paid for this deal");
            }

            finalAmount = deal.getDepositAmount().doubleValue();
        }

        if (paymentFor == PaymentFor.BALANCE) {
            Deal deal = dealRepo.findById(referenceId)
                    .orElseThrow(() -> new RuntimeException("Deal not found"));

            if (!deal.getBuyer().getId().equals(userId)) {
                throw new RuntimeException("You are not authorized to pay for this deal");
            }
            if (deal.getStatus() != DealStatus.CONTACT_UNLOCKED) {
                throw new RuntimeException("This deal is not ready for a balance payment");
            }
            if (deal.isBalancePaid()) {
                throw new RuntimeException("The remaining balance has already been paid for this deal");
            }

            finalAmount = deal.getRemainingAmount().doubleValue();
        }

        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        JSONObject options = new JSONObject();
        options.put("amount", Math.round(finalAmount * 100));
        options.put("currency", "INR");
        options.put("receipt", "txn_" + System.currentTimeMillis());

        com.razorpay.Order razorOrder = client.orders.create(options);

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Payment payment = Payment.builder()
                .razorpayOrderId(razorOrder.get("id"))
                .amount(finalAmount)
                .status(PaymentStatus.CREATED)
                .paymentFor(paymentFor)
                .referenceId(referenceId)
                .paymentTime(LocalDateTime.now())
                .user(user)
                .build();

        return paymentRepo.save(payment);
    }

    @Override
    public void verifyPayment(
            String orderId,
            String paymentId,
            String signature
    ) {
        Payment payment = paymentRepo.findByRazorpayOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            return;
        }

        boolean isValid = RazorpaySignatureUtil.verify(
                orderId,
                paymentId,
                signature,
                keySecret
        );

        if (!isValid) {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepo.save(payment);
            throw new RuntimeException("Invalid Razorpay signature");
        }
        payment.setRazorpayPaymentId(paymentId);
        payment.setRazorpaySignature(signature);
        payment.setStatus(PaymentStatus.SUCCESS);
        paymentRepo.save(payment);

        switch (payment.getPaymentFor()) {
            case CAR_PURCHASE -> handleCarPurchase(payment);
            case SUBSCRIPTION -> handleSubscription(payment);
            case AUCTION_WIN -> handleAuctionWin(payment);
            case DEPOSIT -> handleDeposit(payment);
            case BALANCE -> handleBalance(payment);
        }
    }
    
    private void handleDeposit(Payment payment) {
        dealService.markDepositPaid(payment.getReferenceId(), payment.getRazorpayPaymentId());
    }

    private void handleBalance(Payment payment) {
        dealService.markBalancePaid(payment.getReferenceId(), payment.getRazorpayPaymentId());
    }

    private void handleCarPurchase(Payment payment) {
        Cart cart = cartRepo.findByUser(payment.getUser())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        Order newOrder = Order.builder()
                .user(payment.getUser())
                .payment(payment)
                .orderTime(LocalDateTime.now())
                .status(OrderStatus.SUCCESS)
                .build();

        Order savedOrder = orderRepo.save(newOrder);

        List<OrderItem> items = cart.getItems().stream()
                .map(ci -> OrderItem.builder()
                        .order(savedOrder)
                        .car(ci.getCar())
                        .brand(ci.getCar().getBrand())
                        .model(ci.getCar().getModel())
                        .priceAtPurchase(ci.getPriceAtAddTime())
                        .build())
                .toList();

        savedOrder.setItems(items);
        savedOrder.setTotalAmount(
                items.stream().mapToDouble(OrderItem::getPriceAtPurchase).sum()
        );
        orderRepo.save(savedOrder);

        cart.getItems().clear();
    }

    private void handleSubscription(Payment payment) {

        SubscriptionPlan plan = planRepo.findById(payment.getReferenceId())
                .orElseThrow(() -> new RuntimeException("Subscription plan not found"));

        List<UserSubscription> activeSubs =
                userSubRepo.findByUserAndStatus(payment.getUser(), SubscriptionStatus.ACTIVE);

        for (UserSubscription sub : activeSubs) {
            sub.setStatus(SubscriptionStatus.EXPIRED);
            sub.setEndDate(LocalDateTime.now());
        }

        UserSubscription newSub = new UserSubscription();
        newSub.setUser(payment.getUser());
        newSub.setPlan(plan);
        newSub.setStartDate(LocalDateTime.now());
        newSub.setEndDate(LocalDateTime.now().plusDays(plan.getValidityDays()));
        newSub.setBidsRemaining(plan.getTotalBids());
        newSub.setStatus(SubscriptionStatus.ACTIVE);

        userSubRepo.save(newSub);
    }

    private void handleAuctionWin(Payment payment) {
        Auction auction = auctionRepo.findById(payment.getReferenceId())
                .orElseThrow(() -> new RuntimeException("Auction not found"));

        auction.setPaymentStatus(PaymentStatus.SUCCESS);
        auctionRepo.save(auction);
    }
    
    @Scheduled(fixedRate = 120000) // checks every 2 minutes
    @Transactional
    public void processPendingRefunds() {
        List<Deal> needsRefund = dealRepo.findByStatusAndDepositPaidTrueAndDepositRefundedFalse(DealStatus.DECLINED_BY_SELLER);

        for (Deal deal : needsRefund) {
            try {
                RazorpayClient client = new RazorpayClient(keyId, keySecret);
                JSONObject refundRequest = new JSONObject();
                refundRequest.put("amount", Math.round(deal.getDepositAmount().doubleValue() * 100));

                client.payments.refund(deal.getRazorpayPaymentId(), refundRequest);

                deal.setDepositRefunded(true);
                dealRepo.save(deal);

                System.out.println("💸 Refund issued for deal " + deal.getId());
            } catch (Exception e) {
                System.out.println("⚠️ Refund FAILED for deal " + deal.getId() + ": " + e.getMessage() + " — will retry next cycle");
            }
        }
    }
}
