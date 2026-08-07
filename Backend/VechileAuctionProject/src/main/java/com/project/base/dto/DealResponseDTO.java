package com.project.base.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DealResponseDTO {
    private Long dealId;
    private String dealType;
    private Long carId;
    private String brand;
    private String model;
    private String registrationNo;
    private BigDecimal agreedPrice;
    private BigDecimal depositAmount;
    private String sellerConfirmation;
    private LocalDateTime sellerConfirmDeadline;
    private boolean depositPaid;
    private LocalDateTime depositDeadline;
    private BigDecimal remainingAmount;
    private boolean balancePaid;
    private LocalDateTime balancePaidAt;
    private String status;
    private String buyerName;
    private String sellerName;
    private String sellerContact; // only populated once CONTACT_UNLOCKED
    private String sellerEmail;   // only populated once CONTACT_UNLOCKED

    public Long getDealId() { return dealId; }
    public void setDealId(Long dealId) { this.dealId = dealId; }
    public String getDealType() { return dealType; }
    public void setDealType(String dealType) { this.dealType = dealType; }
    public Long getCarId() { return carId; }
    public void setCarId(Long carId) { this.carId = carId; }
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    public String getRegistrationNo() { return registrationNo; }
    public void setRegistrationNo(String registrationNo) { this.registrationNo = registrationNo; }
    public BigDecimal getAgreedPrice() { return agreedPrice; }
    public void setAgreedPrice(BigDecimal agreedPrice) { this.agreedPrice = agreedPrice; }
    public BigDecimal getDepositAmount() { return depositAmount; }
    public void setDepositAmount(BigDecimal depositAmount) { this.depositAmount = depositAmount; }
    public String getSellerConfirmation() { return sellerConfirmation; }
    public void setSellerConfirmation(String sellerConfirmation) { this.sellerConfirmation = sellerConfirmation; }
    public LocalDateTime getSellerConfirmDeadline() { return sellerConfirmDeadline; }
    public void setSellerConfirmDeadline(LocalDateTime sellerConfirmDeadline) { this.sellerConfirmDeadline = sellerConfirmDeadline; }
    public boolean isDepositPaid() { return depositPaid; }
    public void setDepositPaid(boolean depositPaid) { this.depositPaid = depositPaid; }
    public LocalDateTime getDepositDeadline() { return depositDeadline; }
    public void setDepositDeadline(LocalDateTime depositDeadline) { this.depositDeadline = depositDeadline; }
    public BigDecimal getRemainingAmount() { return remainingAmount; }
    public void setRemainingAmount(BigDecimal remainingAmount) { this.remainingAmount = remainingAmount; }
    public boolean isBalancePaid() { return balancePaid; }
    public void setBalancePaid(boolean balancePaid) { this.balancePaid = balancePaid; }
    public LocalDateTime getBalancePaidAt() { return balancePaidAt; }
    public void setBalancePaidAt(LocalDateTime balancePaidAt) { this.balancePaidAt = balancePaidAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }
    public String getSellerName() { return sellerName; }
    public void setSellerName(String sellerName) { this.sellerName = sellerName; }
    public String getSellerContact() { return sellerContact; }
    public void setSellerContact(String sellerContact) { this.sellerContact = sellerContact; }
    public String getSellerEmail() { return sellerEmail; }
    public void setSellerEmail(String sellerEmail) { this.sellerEmail = sellerEmail; }
} 