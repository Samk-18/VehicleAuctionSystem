package com.project.base.repository;

import com.project.base.pojo.Deal;
import com.project.base.pojo.DealStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface DealRepository extends JpaRepository<Deal, Long> {
    Optional<Deal> findByCarIdAndStatus(Long carId, DealStatus status);
    List<Deal> findByStatusAndSellerConfirmDeadlineBefore(DealStatus status, LocalDateTime time);
    List<Deal> findByStatusAndDepositDeadlineBefore(DealStatus status, LocalDateTime time);
    List<Deal> findByStatusAndDepositPaidTrueAndDepositRefundedFalse(DealStatus status);
    List<Deal> findByBuyerId(Long buyerId);
    List<Deal> findByCarSellerId(Long sellerId);
}
