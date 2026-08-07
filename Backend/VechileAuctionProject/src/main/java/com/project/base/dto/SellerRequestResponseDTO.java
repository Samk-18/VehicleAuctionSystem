package com.project.base.dto;

import java.time.LocalDateTime;

public class SellerRequestResponseDTO {

    private Long requestId;
    private Long userId;
    private String userEmail;
    private String userFirstName;
    private String userLastName;
    private String documentUrl;
    private String businessName;
    private String status;
    private boolean flaggedSuspicious;
    private LocalDateTime submittedAt;

    public Long getRequestId() { return requestId; }
    public void setRequestId(Long requestId) { this.requestId = requestId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getUserFirstName() { return userFirstName; }
    public void setUserFirstName(String userFirstName) { this.userFirstName = userFirstName; }

    public String getUserLastName() { return userLastName; }
    public void setUserLastName(String userLastName) { this.userLastName = userLastName; }

    public String getDocumentUrl() { return documentUrl; }
    public void setDocumentUrl(String documentUrl) { this.documentUrl = documentUrl; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isFlaggedSuspicious() { return flaggedSuspicious; }
    public void setFlaggedSuspicious(boolean flaggedSuspicious) { this.flaggedSuspicious = flaggedSuspicious; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}
