package com.project.base.dto;

import com.project.base.pojo.*;
import lombok.*;
import java.util.List;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class CarResponseDTO {
	
		private Long id;
		
	    private String registrationNo;
	    
	    private String brand;
	    
	    private String manufacturer;
	    
	    private String model;
	    
	    private Status status;
	    
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

	    private List<CarImage> images;	
	    
	    private String sellerName;
	    private String sellerEmail;
	    private String sellerPhone;
	    
	    private Long cartItemId;       



}

