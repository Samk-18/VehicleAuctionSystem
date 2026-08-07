package com.project.base.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BidResponseDTO {

    private BigDecimal bidAmount;
    private String bidderName;
    private Long bidderId;
    private LocalDateTime bidTime;
}
