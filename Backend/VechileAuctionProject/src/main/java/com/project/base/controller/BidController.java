package com.project.base.controller;

import com.project.base.dto.ApiResponse;
import com.project.base.dto.BidRequest;
import com.project.base.services.BidService;
import com.project.base.services.UserService;

import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.project.base.dto.BidResponseDTO;
import com.project.base.dto.ListResponse;
import com.project.base.dto.MyBidResponseDTO;

@RestController
@Slf4j
@RequestMapping("/api/bids")
public class BidController {

    @Autowired
    private BidService bidService;

    @Autowired
    private UserService userService;

    @PostMapping("/place/{auctionId}")
    @PreAuthorize("hasAnyAuthority('ROLE_BUYER','ROLE_SELLER')")
    public ResponseEntity<ApiResponse> placeBid(
            @PathVariable Long auctionId,
            @RequestBody BidRequest request
    ) {

        Long buyerId = userService.getCurrentUser().getId();

        bidService.placeBid(
                auctionId,
                buyerId,
                request.getBidAmount()
        );

        return ResponseEntity.ok(
                new ApiResponse("Bid placed successfully")
        );
    }
    @GetMapping("/auction/{auctionId}")
    @PreAuthorize("hasAuthority('ROLE_BUYER') or hasAuthority('ROLE_SELLER')")
    public ResponseEntity<List<BidResponseDTO>> getBidHistory(
            @PathVariable Long auctionId
    ) {
        return ResponseEntity.ok(
                bidService.getBidHistory(auctionId)
        );
    }
    @GetMapping("/my-bids")
    @PreAuthorize("hasAuthority('ROLE_BUYER') or hasAuthority('ROLE_SELLER')")
    public ResponseEntity<List<MyBidResponseDTO>> getMyBids() {

        Long buyerId = userService.getCurrentUser().getId();
        return ResponseEntity.ok(
            bidService.getBidsByBuyer(buyerId)
        );
    }



}
