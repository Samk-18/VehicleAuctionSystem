package com.project.base.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartResponseDTO {

    private List<CarResponseDTO> cars;
    private double totalAmount;
    private Long cartId;             


    public CartResponseDTO(Long cartId, List<CarResponseDTO> cars, double totalAmount) {
        this.cartId = cartId;
        this.cars = cars;
        this.totalAmount = totalAmount;
    }
}

