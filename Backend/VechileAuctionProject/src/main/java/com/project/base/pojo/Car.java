package com.project.base.pojo;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "cars")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@AttributeOverride(name = "id", column = @Column(name = "car_id"))
public class Car extends BaseEntity {
	
	@Enumerated(EnumType.STRING)
	@Column(name = "vehicle_category", nullable = false)
	private VehicleCategory vehicleCategory = VehicleCategory.CAR;
	
    @NotBlank
    @Column(name = "registration_no", nullable = false, unique = true, length = 20)
    private String registrationNo;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String brand;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String model;

    @Min(1900)
    @Column(name = "manufacture_year")
    private int manufactureYear;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "fuel_type", nullable = false, length = 20)
    private FuelType fuelType;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Transmission transmission;

    @PositiveOrZero
    private Integer mileage;

    @Column(length = 30)
    private String color;

    @PositiveOrZero
    @Column(name = "engine_cc")
    private Integer engineCc;

    @PositiveOrZero
    @Column(nullable = false)
    private double price;

    @Column(columnDefinition = "TEXT")
    private String description;

    @JsonManagedReference
    @OneToMany(
        mappedBy = "car",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.EAGER
    )
    private List<CarImage> images = new ArrayList<>();

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "sale_type", nullable = false, length = 20)
    private SaleType saleType;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Status status;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    @JsonIgnoreProperties({
        "hibernateLazyInitializer",
        "handler",
        "password",
        "roles"
    })
    private User seller;

    @NotBlank
    @Column(nullable = false)
    private String manufacturer;

    @PositiveOrZero
    @Column(name = "km_driven", nullable = false)
    private Integer kmDriven;


  
    @Column(name = "auction_attempts", nullable = false)
    private int auctionAttempts = 0;

   
    @Column(name = "last_auction_ended_at")
    private LocalDateTime lastAuctionEndedAt;
}
