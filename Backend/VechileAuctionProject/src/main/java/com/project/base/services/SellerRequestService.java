package com.project.base.services;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.project.base.dto.SellerRequestResponseDTO;
import com.project.base.pojo.User;

public interface SellerRequestService {

    void submitRequest(User user, String businessName, MultipartFile document) throws IOException;

    SellerRequestResponseDTO getMyLatestRequest(User user);

    List<SellerRequestResponseDTO> getPendingRequests();

    void approveRequest(Long requestId);

    void rejectRequest(Long requestId, String adminNote);
}