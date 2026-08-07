package com.project.base.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.project.base.dto.CarDto;
import com.project.base.dto.UserDTO;
import com.project.base.exception.ApiException;
import com.project.base.pojo.Car;
import com.project.base.pojo.User;
import com.project.base.services.CarService;
import com.project.base.services.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:5173")
@Validated
@RequiredArgsConstructor
public class UserController {

    private static final Logger log =
            LoggerFactory.getLogger(UserController.class);

    private final UserService userService;
    private final CarService carService;

   

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(
            @Valid @RequestBody UserDTO userDto
    ) throws ApiException {

        log.info("REGISTER REQUEST RECEIVED FOR EMAIL: {}", userDto.getEmail());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userService.registerUser(userDto));
    }

    @GetMapping("/ping")
    public String ping() {
        log.info("🔥 USER PING HIT");
        return "Server is running!";
    }

  

    @PostMapping(
        value = "/cars/add",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Car> addNewCar(

        @Valid @RequestPart("car") CarDto carDto,
        @RequestPart(value = "images", required = false)
        MultipartFile[] images
    ) {

        log.info("🔥 ADD CAR API HIT");

        User currentUser = userService.getCurrentUser();
        Long sellerId = currentUser.getId();

        log.info("✅ Seller ID = {}", sellerId);
        log.info("✅ Car Registration = {}", carDto.getRegistrationNo());
        log.info("✅ Images count = {}", images == null ? 0 : images.length);

        Car savedCar =
                carService.addNewCar(carDto, images, sellerId);

        log.info("🚗 Car added successfully with ID = {}",
                savedCar.getId());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedCar);
    }

    @GetMapping("/cars/ping")
    public String carsPing() {
        log.info("🔥 USER CARS PING HIT");
        return "Cars API is running!";
    }
}
