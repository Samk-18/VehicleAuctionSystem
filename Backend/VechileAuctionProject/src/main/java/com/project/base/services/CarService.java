package com.project.base.services;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.project.base.dto.CarDto;
import com.project.base.dto.CarResponseDTO;
import com.project.base.pojo.Car;

public interface CarService {

    Car addNewCar(CarDto carDto, MultipartFile[] images, Long sellerId);

    List<CarResponseDTO> getPendingCars();

    Car approveCar(Long carId);

    Car rejectCar(Long carId);

    List<CarResponseDTO> getAllAvailableCars();

    List<CarResponseDTO> getAllCars();

    void submitForApproval(Long carId, Long sellerId);
    
    void listForDirectSale(Long carId, Long sellerId);
}
