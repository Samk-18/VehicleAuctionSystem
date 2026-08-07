package com.project.base.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "seller_profiles")
@Getter
@Setter
@NoArgsConstructor
public class SellerProfile extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    
    @Column(name = "id_proof_number", nullable = false, unique = true, length = 20)
    private String idProofNumber;

    @Column(name = "driving_license_number", nullable = false, unique = true, length = 30)
    private String drivingLicenseNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "seller_type")
    private SellerType sellerType = SellerType.INDIVIDUAL;

    @Column(name = "dealer_name", length = 150)
    private String dealerName;
}