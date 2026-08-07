package com.project.base.services;

import java.time.LocalDateTime;
import java.util.List;

import com.project.base.dto.AuctionResponseDTO;
import com.project.base.pojo.User;

public interface AuctionService {

    List<AuctionResponseDTO> viewActiveAuctions();

    AuctionResponseDTO getAuctionById(Long auctionId);

    void startAuction(Long carId, Long sellerId, LocalDateTime scheduledStartTime, int durationMinutes);
    
    List<AuctionResponseDTO> getMyAuctionsAsSeller(Long sellerId);
    
    void closeExpiredAuctions();

    List<AuctionResponseDTO> getMyWonAuctions(User user);

    List<AuctionResponseDTO> getAllAuctionsForAdmin();

    void markAsPaid(Long auctionId);
    
    void cancelAuction(Long auctionId);
    
    void extendAuction(Long auctionId, int extraMinutes);
    
    List<AuctionResponseDTO> getLiveAuctionsForAdmin();
}
