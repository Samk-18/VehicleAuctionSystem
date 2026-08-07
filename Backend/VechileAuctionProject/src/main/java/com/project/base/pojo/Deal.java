package com.project.base.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "deals")
@Getter
@Setter
@NoArgsConstructor
public class Deal extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DealType dealType;

    @ManyToOne
    @JoinColumn(name = "car_id", nullable = false)
    private Car car;

    @ManyToOne
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @ManyToOne
    @JoinColumn(name = "auction_id")
    private Auction auction; // null for direct sale

    @Column(name = "agreed_price", nullable = false)
    private BigDecimal agreedPrice;

    @Column(name = "deposit_amount", nullable = false)
    private BigDecimal depositAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "seller_confirmation", nullable = false)
    private SellerConfirmation sellerConfirmation = SellerConfirmation.PENDING;

    @Column(name = "seller_confirm_deadline", nullable = false)
    private LocalDateTime sellerConfirmDeadline;

    @Column(name = "deposit_paid", nullable = false)
    private boolean depositPaid = false;

    @Column(name = "deposit_deadline", nullable = false)
    private LocalDateTime depositDeadline;

    @Column(name = "deposit_refunded", nullable = false)
    private boolean depositRefunded = false;

    @Column(name = "razorpay_payment_id")
    private String razorpayPaymentId;

    @Column(name = "balance_paid", nullable = false)
    private boolean balancePaid = false;

    @Column(name = "balance_paid_at")
    private LocalDateTime balancePaidAt;

    @Column(name = "razorpay_balance_payment_id")
    private String razorpayBalancePaymentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DealStatus status = DealStatus.PENDING;

    /**
     * Amount still owed after the deposit — agreedPrice minus depositAmount.
     * Not persisted; always derived so it can never drift out of sync.
     */
    @Transient
    public BigDecimal getRemainingAmount() {
        if (agreedPrice == null || depositAmount == null) {
            return BigDecimal.ZERO;
        }
        BigDecimal remaining = agreedPrice.subtract(depositAmount);
        return remaining.signum() < 0 ? BigDecimal.ZERO : remaining;
    }
}