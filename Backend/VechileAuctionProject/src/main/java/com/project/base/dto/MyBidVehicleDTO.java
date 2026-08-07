package com.project.base.dto;

import java.math.BigDecimal;

public class MyBidVehicleDTO {

    private Long auctionId;
    private Long carId;

    private String brand;
    private String model;

    private BigDecimal myHighestBid;
    private BigDecimal currentHighestBid;

    private String auctionStatus;
    private boolean won;

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

    public BigDecimal getMyHighestBid() {
        return myHighestBid;
    }

    public void setMyHighestBid(BigDecimal myHighestBid) {
        this.myHighestBid = myHighestBid;
    }

    public BigDecimal getCurrentHighestBid() {
        return currentHighestBid;
    }

    public void setCurrentHighestBid(BigDecimal currentHighestBid) {
        this.currentHighestBid = currentHighestBid;
    }

    public String getAuctionStatus() {
        return auctionStatus;
    }

    public void setAuctionStatus(String auctionStatus) {
        this.auctionStatus = auctionStatus;
    }

    public boolean isWon() {
        return won;
    }

    public void setWon(boolean won) {
        this.won = won;
    }
}
