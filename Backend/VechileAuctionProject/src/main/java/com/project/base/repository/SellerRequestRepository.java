package com.project.base.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.base.pojo.SellerRequest;
import com.project.base.pojo.SellerRequestStatus;
import com.project.base.pojo.User;

public interface SellerRequestRepository extends JpaRepository<SellerRequest, Long> {

    List<SellerRequest> findByStatus(SellerRequestStatus status);

    Optional<SellerRequest> findTopByUserOrderByCreatedOnDesc(User user);

    boolean existsByUserAndStatus(User user, SellerRequestStatus status);
}
