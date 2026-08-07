package com.project.base.controller;

import com.project.base.dto.ApiResponse;
import com.project.base.dto.DealResponseDTO;
import com.project.base.services.DealService;
import com.project.base.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/deals")
public class DealController {

    @Autowired
    private DealService dealService;

    @Autowired
    private UserService userService;

    @GetMapping("/mine")
    @PreAuthorize("hasAuthority('ROLE_BUYER')")
    public ResponseEntity<List<DealResponseDTO>> getMyDealsAsBuyer() {
        Long buyerId = userService.getCurrentUser().getId();
        return ResponseEntity.ok(dealService.getMyDealsAsBuyer(buyerId));
    }

    @GetMapping("/seller")
    @PreAuthorize("hasAuthority('ROLE_SELLER')")
    public ResponseEntity<List<DealResponseDTO>> getMyDealsAsSeller() {
        Long sellerId = userService.getCurrentUser().getId();
        return ResponseEntity.ok(dealService.getMyDealsAsSeller(sellerId));
    }
    
    @PostMapping("/direct-sale/{carId}")
    @PreAuthorize("hasAuthority('ROLE_BUYER')")
    public ResponseEntity<?> buyDirectSale(@PathVariable Long carId) {
        try {
            Long buyerId = userService.getCurrentUser().getId();
            var deal = dealService.createDealForDirectSale(carId, buyerId);
            return ResponseEntity.ok(dealService.getDealById(deal.getId(), buyerId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage()));
        }
    }

    @GetMapping("/{dealId}")
    @PreAuthorize("hasAuthority('ROLE_BUYER') or hasAuthority('ROLE_SELLER')")
    public ResponseEntity<?> getDeal(@PathVariable Long dealId) {
        try {
            Long userId = userService.getCurrentUser().getId();
            return ResponseEntity.ok(dealService.getDealById(dealId, userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage()));
        }
    }

    @PostMapping("/{dealId}/confirm")
    @PreAuthorize("hasAuthority('ROLE_SELLER')")
    public ResponseEntity<ApiResponse> confirmDeal(@PathVariable Long dealId) {
        try {
            Long sellerId = userService.getCurrentUser().getId();
            dealService.sellerConfirm(dealId, sellerId);
            return ResponseEntity.ok(new ApiResponse("Sale confirmed."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage()));
        }
    }

    @PostMapping("/{dealId}/decline")
    @PreAuthorize("hasAuthority('ROLE_SELLER')")
    public ResponseEntity<ApiResponse> declineDeal(@PathVariable Long dealId) {
        try {
            Long sellerId = userService.getCurrentUser().getId();
            dealService.sellerDecline(dealId, sellerId);
            return ResponseEntity.ok(new ApiResponse("Sale declined."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage()));
        }
    }
}