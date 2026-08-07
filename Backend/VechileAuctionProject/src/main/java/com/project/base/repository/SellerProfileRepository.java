package com.project.base.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.project.base.pojo.SellerProfile;

public interface SellerProfileRepository extends JpaRepository<SellerProfile, Long> {
    Optional<SellerProfile> findByUser_Id(Long userId);
    void deleteByUserId(Long userId);
    boolean existsByIdProofNumber(String idProofNumber);
    boolean existsByDrivingLicenseNumber(String drivingLicenseNumber);
}
