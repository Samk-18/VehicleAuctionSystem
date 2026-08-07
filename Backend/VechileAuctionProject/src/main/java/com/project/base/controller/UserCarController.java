package com.project.base.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.base.dto.ApiResponse;
import com.project.base.dto.CarDto;
import com.project.base.dto.CarResponseDTO;
import com.project.base.services.UserCarService;
import com.project.base.services.UserService;

@RestController
@RequestMapping("/api/cars")
public class UserCarController {

    @Autowired
    private UserCarService userCarService;

    @Autowired
    private UserService userService;

    
    @GetMapping("/mine")
    public ResponseEntity<List<CarResponseDTO>> getMyCars() {
        Long sellerId = userService.getCurrentUser().getId();
        List<CarResponseDTO> cars = userCarService.getCarsBySeller(sellerId);
        return ResponseEntity.ok(cars);
    }
    
    @DeleteMapping("/{carId}")
    public ResponseEntity<ApiResponse> deleteCar(@PathVariable Long carId) {
        try {
            Long sellerId = userService.getCurrentUser().getId();
            ApiResponse response = userCarService.deleteCar(carId, sellerId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage()));
        }
    }
}
