package com.project.base.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "seller_requests")
@Getter
@Setter
@NoArgsConstructor
public class SellerRequest extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "document_url", nullable = false)
    private String documentUrl;

    @Column(name = "business_name")
    private String businessName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SellerRequestStatus status = SellerRequestStatus.PENDING;

    @Column(name = "admin_note")
    private String adminNote;

    @Column(name = "flagged_suspicious")
    private boolean flaggedSuspicious = false;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;
}
