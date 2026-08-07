package com.project.base.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class MyBidResponseDTO {

    private Long auctionId;
    private String brand;
    private String model;
    private BigDecimal bidAmount;
    private LocalDateTime bidTime;
    private String auctionStatus;

   
}
