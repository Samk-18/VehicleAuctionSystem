package com.project.base.services;

import java.util.List;

import com.project.base.dto.BidResponseDTO;
import com.project.base.dto.MyBidResponseDTO;

public interface BidService {

    void placeBid(Long auctionId, Long buyerId, double bidAmount);

    List<BidResponseDTO> getBidHistory(Long auctionId);

    List<MyBidResponseDTO> getBidsByBuyer(Long buyerId);
}
