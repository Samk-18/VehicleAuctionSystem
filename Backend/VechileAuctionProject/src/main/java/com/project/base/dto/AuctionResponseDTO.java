package com.project.base.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class AuctionResponseDTO {

    private Long auctionId;
    private Long carId;

    private String brand;
    private String model;

    private BigDecimal currentPrice;
    private LocalDateTime endTime;
    private String status;

    private Long winnerId;
    private String winnerName;
    private BigDecimal finalPrice;
    private List<String> imageUrls;
    private int auctionAttempts;
    
    private int bidCount;
    private String topBidderName;
    private BigDecimal topBidAmount;
    private boolean paid;
    
    private String fuelType;
    private String transmission;
    
    private String manufacturer;
    private int manufactureYear;

    private int kmDriven;
    private double mileage;
    private String color;
    private int engineCc;
    private String description;
    private String registrationNo;
    private String saleType;
    private String sellerName;

    public String getManufacturer() { return manufacturer; }
    public void setManufacturer(String manufacturer) { this.manufacturer = manufacturer; }
    public int getManufactureYear() { return manufactureYear; }
    public void setManufactureYear(int manufactureYear) { this.manufactureYear = manufactureYear; }
    public String getFuelType() { return fuelType; }
    public void setFuelType(String fuelType) { this.fuelType = fuelType; }
    public String getTransmission() { return transmission; }
    public void setTransmission(String transmission) { this.transmission = transmission; }
    public int getKmDriven() { return kmDriven; }
    public void setKmDriven(int kmDriven) { this.kmDriven = kmDriven; }
    public double getMileage() { return mileage; }
    public void setMileage(double mileage) { this.mileage = mileage; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public int getEngineCc() { return engineCc; }
    public void setEngineCc(int engineCc) { this.engineCc = engineCc; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getRegistrationNo() { return registrationNo; }
    public void setRegistrationNo(String registrationNo) { this.registrationNo = registrationNo; }
    public String getSaleType() { return saleType; }
    public void setSaleType(String saleType) { this.saleType = saleType; }
    public String getSellerName() { return sellerName; }
    public void setSellerName(String sellerName) { this.sellerName = sellerName; }
     
    public int getBidCount() { 
    	return bidCount; 
    }
    
    public void setBidCount(int bidCount) { 
    	this.bidCount = bidCount; 
    }
    
    public String getTopBidderName() { 
    	return topBidderName; 
    }
    
    public void setTopBidderName(String topBidderName) { 
    	this.topBidderName = topBidderName; 
    }
    
    public BigDecimal getTopBidAmount() { 
    	return topBidAmount; 
    }
    
    public void setTopBidAmount(BigDecimal topBidAmount) { 
    	this.topBidAmount = topBidAmount; 
    }
    
    public boolean isPaid() { 
    	return paid; 
    }
    
    public void setPaid(boolean paid) { 
    	this.paid = paid; 
    }
    
    public int getAuctionAttempts() {
        return auctionAttempts;
    }

    public void setAuctionAttempts(int auctionAttempts) {
        this.auctionAttempts = auctionAttempts;
    }
    
    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public Long getAuctionId() {
        return auctionId;
    }

    public void setAuctionId(Long auctionId) {
        this.auctionId = auctionId;
    }

    public Long getCarId() {
        return carId;
    }

    public void setCarId(Long carId) {
        this.carId = carId;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    public Long getWinnerId() {
        return winnerId;
    }

    public void setWinnerId(Long winnerId) {
        this.winnerId = winnerId;
    }

    public String getWinnerName() {
        return winnerName;
    }

    public void setWinnerName(String winnerName) {
        this.winnerName = winnerName;
    }

    public BigDecimal getFinalPrice() {
        return finalPrice;
    }

    public void setFinalPrice(BigDecimal finalPrice) {
        this.finalPrice = finalPrice;
    }
}
