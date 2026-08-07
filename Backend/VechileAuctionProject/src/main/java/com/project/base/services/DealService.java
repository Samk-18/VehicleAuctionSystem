package com.project.base.services;

import com.project.base.dto.DealResponseDTO;
import com.project.base.pojo.Auction;
import com.project.base.pojo.Bid;
import com.project.base.pojo.Deal;

import java.util.List;

public interface DealService {
    Deal createDealForAuctionWin(Auction auction, Bid winningBid);
    Deal createDealForDirectSale(Long carId, Long buyerId);
    void sellerConfirm(Long dealId, Long sellerId);
    void sellerDecline(Long dealId, Long sellerId);
    void markDepositPaid(Long dealId, String razorpayPaymentId);
    void markBalancePaid(Long dealId, String razorpayPaymentId);
    void resolveExpiredDeals();
    List<DealResponseDTO> getMyDealsAsBuyer(Long buyerId);
    List<DealResponseDTO> getMyDealsAsSeller(Long sellerId);
    DealResponseDTO getDealById(Long dealId, Long requesterId);
}
