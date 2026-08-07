package com.project.base.dto;

import com.project.base.pojo.*;
import lombok.*;

@Getter 
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CarDto {
    private String registrationNo;

    private String brand;

    private String manufacturer;

    private String model;

    private int manufactureYear;


    private FuelType fuelType;


    private Transmission transmission;


    private Integer kmDriven;


    private Integer mileage;


    private String color;


    private Integer engineCc;


    private double price;


    private String description;


    private SaleType saleType;
}