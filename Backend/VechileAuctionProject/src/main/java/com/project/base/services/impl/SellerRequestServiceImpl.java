package com.project.base.services.impl;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.project.base.dto.SellerRequestResponseDTO;
import com.project.base.pojo.Role;
import com.project.base.pojo.RoleName;
import com.project.base.pojo.SellerRequest;
import com.project.base.pojo.SellerRequestStatus;
import com.project.base.pojo.User;
import com.project.base.repository.RoleRepository;
import com.project.base.repository.SellerRequestRepository;
import com.project.base.repository.UserRepository;
import com.project.base.services.ImageStorageService;
import com.project.base.services.SellerRequestService;

@Service
public class SellerRequestServiceImpl implements SellerRequestService {

    @Autowired
    private SellerRequestRepository sellerRequestRepo;

    @Autowired
    private ImageStorageService imageStorageService;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public void submitRequest(User user, String businessName, MultipartFile document) throws IOException {

        if (sellerRequestRepo.existsByUserAndStatus(user, SellerRequestStatus.PENDING)) {
            throw new RuntimeException("You already have a pending seller request.");
        }

        String documentUrl = imageStorageService.storeImage(document);

        SellerRequest request = new SellerRequest();
        request.setUser(user);
        request.setBusinessName(businessName);
        request.setDocumentUrl(documentUrl);
        request.setStatus(SellerRequestStatus.PENDING);

        // Simple heuristic flags — not real identity verification,
        // just a hint for the admin to look closer.
        boolean newAccount = user.getCreatedOn() != null
                && Duration.between(user.getCreatedOn(), LocalDateTime.now()).toHours() < 24;

        boolean suspiciousFileType = document.getContentType() == null
                || (!document.getContentType().startsWith("image/")
                    && !document.getContentType().equals("application/pdf"));

        boolean tinyFile = document.getSize() < 10_000; // under ~10KB is suspicious for a real ID/doc

        request.setFlaggedSuspicious(newAccount || suspiciousFileType || tinyFile);

        sellerRequestRepo.save(request);
    }

    @Override
    @Transactional(readOnly = true)
    public SellerRequestResponseDTO getMyLatestRequest(User user) {
        return sellerRequestRepo.findTopByUserOrderByCreatedOnDesc(user)
                .map(this::mapToDto)
                .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SellerRequestResponseDTO> getPendingRequests() {
        return sellerRequestRepo.findByStatus(SellerRequestStatus.PENDING)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void approveRequest(Long requestId) {

        SellerRequest request = sellerRequestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        User user = request.getUser();

        Role sellerRole = roleRepository.findByRoleName(RoleName.ROLE_SELLER)
                .orElseThrow(() -> new RuntimeException("ROLE_SELLER not found"));

        user.getRoles().add(sellerRole);
        userRepository.save(user);

        request.setStatus(SellerRequestStatus.APPROVED);
        request.setReviewedAt(LocalDateTime.now());
        sellerRequestRepo.save(request);
    }

    @Override
    @Transactional
    public void rejectRequest(Long requestId, String adminNote) {

        SellerRequest request = sellerRequestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus(SellerRequestStatus.REJECTED);
        request.setAdminNote(adminNote);
        request.setReviewedAt(LocalDateTime.now());
        sellerRequestRepo.save(request);
    }

    private SellerRequestResponseDTO mapToDto(SellerRequest request) {
        SellerRequestResponseDTO dto = new SellerRequestResponseDTO();
        dto.setRequestId(request.getId());
        dto.setUserId(request.getUser().getId());
        dto.setUserEmail(request.getUser().getEmail());
        dto.setUserFirstName(request.getUser().getFirstName());
        dto.setUserLastName(request.getUser().getLastName());
        dto.setDocumentUrl(request.getDocumentUrl());
        dto.setBusinessName(request.getBusinessName());
        dto.setStatus(request.getStatus().name());
        dto.setFlaggedSuspicious(request.isFlaggedSuspicious());
        dto.setSubmittedAt(request.getCreatedOn());
        return dto;
    }
}
