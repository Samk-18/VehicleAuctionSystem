package com.project.base.controller;

import com.project.base.dto.AuctionResponseDTO;
import com.project.base.dto.ApiResponse;
import com.project.base.pojo.User;
import com.project.base.services.AuctionService;
import com.project.base.services.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/auctions")
public class AuctionController {

    @Autowired
    private AuctionService auctionService;

    @Autowired
    private UserService userService;


    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_BUYER','ROLE_SELLER','ROLE_ADMIN')")
    public ResponseEntity<List<AuctionResponseDTO>> viewAuctions() {

        return ResponseEntity.ok(
                auctionService.viewActiveAuctions()
        );
    }


    @GetMapping("/{auctionId}")
    @PreAuthorize("hasAuthority('ROLE_BUYER') or hasAuthority('ROLE_SELLER')")
    public ResponseEntity<AuctionResponseDTO> getAuctionById(
            @PathVariable Long auctionId) {

        return ResponseEntity.ok(
                auctionService.getAuctionById(auctionId)
        );
    }


    @PostMapping("/start/{carId}")
    @PreAuthorize("hasAuthority('ROLE_SELLER')")
    public ResponseEntity<ApiResponse> startAuction(
            @PathVariable Long carId,
            @RequestParam(required = false) String scheduledStartTime, // ISO string, e.g. 2026-08-02T15:30:00
            @RequestParam(defaultValue = "10") int durationMinutes) {
        try {
            Long sellerId = userService.getCurrentUser().getId();
            LocalDateTime scheduled = (scheduledStartTime != null && !scheduledStartTime.isBlank())
                    ? LocalDateTime.parse(scheduledStartTime)
                    : null;
            auctionService.startAuction(carId, sellerId, scheduled, durationMinutes);
            return ResponseEntity.ok(new ApiResponse(
                    scheduled != null ? "Auction scheduled successfully" : "Auction started!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage()));
        }
    }

    @GetMapping("/my-wins")
    @PreAuthorize("hasAuthority('ROLE_BUYER')")
    public ResponseEntity<List<AuctionResponseDTO>> getMyWonAuctions() {

        User user = userService.getCurrentUser();

        return ResponseEntity.ok(
                auctionService.getMyWonAuctions(user)
        );
    }
    @GetMapping("/admin/all")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<AuctionResponseDTO>> getAllAuctionsForAdmin() {

        return ResponseEntity.ok(
                auctionService.getAllAuctionsForAdmin()
        );
    }
    @PostMapping("/pay/{auctionId}")
    @PreAuthorize("hasAnyAuthority('ROLE_BUYER','ROLE_SELLER')")
    public ResponseEntity<?> payAuction(@PathVariable Long auctionId) {

        auctionService.markAsPaid(auctionId);

        return ResponseEntity.ok("Payment successful");
    }
    @GetMapping("/admin/live")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<AuctionResponseDTO>> getLiveAuctionsForAdmin() {
        return ResponseEntity.ok(auctionService.getLiveAuctionsForAdmin());
    }

    @PostMapping("/admin/cancel/{auctionId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse> cancelAuction(@PathVariable Long auctionId) {
        try {
            auctionService.cancelAuction(auctionId);
            return ResponseEntity.ok(new ApiResponse("Auction cancelled successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage()));
        }
    }

    @PostMapping("/admin/extend/{auctionId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse> extendAuction(
            @PathVariable Long auctionId,
            @RequestParam int minutes) {
        try {
            auctionService.extendAuction(auctionId, minutes);
            return ResponseEntity.ok(new ApiResponse("Auction extended by " + minutes + " minutes"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/mine")
    @PreAuthorize("hasAuthority('ROLE_SELLER')")
    public ResponseEntity<List<AuctionResponseDTO>> getMyAuctionsAsSeller() {
        Long sellerId = userService.getCurrentUser().getId();
        return ResponseEntity.ok(auctionService.getMyAuctionsAsSeller(sellerId));
    }
}