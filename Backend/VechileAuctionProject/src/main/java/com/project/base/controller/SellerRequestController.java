package com.project.base.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.project.base.dto.ApiResponse;
import com.project.base.dto.SellerRequestResponseDTO;
import com.project.base.pojo.User;
import com.project.base.services.SellerRequestService;

@RestController
@RequestMapping("/seller-requests")
public class SellerRequestController {

    @Autowired
    private SellerRequestService sellerRequestService;

    @PostMapping(consumes = "multipart/form-data")
    @PreAuthorize("hasAuthority('ROLE_BUYER')")
    public ResponseEntity<ApiResponse> submitRequest(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String businessName,
            @RequestPart("document") MultipartFile document) throws IOException {

        sellerRequestService.submitRequest(user, businessName, document);
        return ResponseEntity.ok(new ApiResponse("Seller request submitted successfully. Awaiting admin review."));
    }

    @GetMapping("/my-status")
    public ResponseEntity<SellerRequestResponseDTO> getMyStatus(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(sellerRequestService.getMyLatestRequest(user));
    }

    @GetMapping("/admin/pending")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<SellerRequestResponseDTO>> getPending() {
        return ResponseEntity.ok(sellerRequestService.getPendingRequests());
    }

    @PutMapping("/admin/{id}/approve")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse> approve(@PathVariable Long id) {
        sellerRequestService.approveRequest(id);
        return ResponseEntity.ok(new ApiResponse("Seller request approved."));
    }

    @PutMapping("/admin/{id}/reject")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse> reject(@PathVariable Long id, @RequestParam(required = false) String note) {
        sellerRequestService.rejectRequest(id, note);
        return ResponseEntity.ok(new ApiResponse("Seller request rejected."));
    }
}