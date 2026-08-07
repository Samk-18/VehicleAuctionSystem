package com.project.base.services.impl;

import com.project.base.dto.CarDto;
import com.project.base.dto.CarResponseDTO;
import com.project.base.pojo.Car;
import com.project.base.pojo.CarImage;
import com.project.base.pojo.Role;
import com.project.base.pojo.RoleName;
import com.project.base.pojo.SaleType;
import com.project.base.pojo.Status;
import com.project.base.pojo.User;
import com.project.base.repository.CarRepository;
import com.project.base.repository.RoleRepository;
import com.project.base.repository.UserRepository;
import com.project.base.repository.CarImageRepository;
import com.project.base.services.CarService;
import com.project.base.services.ImageStorageService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CarServiceImpl implements CarService {

    private final CarRepository carRepo;
    private final CarImageRepository carImageRepository;
    private final UserRepository userRepo;
    private final ImageStorageService imageStorageService;
    private final RoleRepository roleRepository;

 
    @Override
    public Car addNewCar(CarDto carDto, MultipartFile[] images, Long sellerId) {

        User user = userRepo.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isSeller = user.getRoles().stream()
                .anyMatch(role -> role.getRoleName() == RoleName.ROLE_SELLER);

        if (!isSeller) {
            Role sellerRole = roleRepository.findByRoleName(RoleName.ROLE_SELLER)
                    .orElseThrow(() -> new RuntimeException("ROLE_SELLER not found"));

            user.getRoles().add(sellerRole);
            userRepo.save(user);
        }

        Car car = new Car();
        if (carRepo.existsByRegistrationNo(carDto.getRegistrationNo().trim().toUpperCase())) {
            throw new RuntimeException("A vehicle with this registration number is already listed.");
        }
        car.setRegistrationNo(carDto.getRegistrationNo());
        car.setBrand(carDto.getBrand());
        car.setManufacturer(carDto.getManufacturer());
        car.setModel(carDto.getModel());
        car.setManufactureYear(carDto.getManufactureYear());
        car.setFuelType(carDto.getFuelType());
        car.setTransmission(carDto.getTransmission());
        car.setKmDriven(carDto.getKmDriven());
        car.setSaleType(carDto.getSaleType());
        car.setMileage(carDto.getMileage());
        car.setEngineCc(carDto.getEngineCc());
        car.setPrice(carDto.getPrice());
        car.setColor(carDto.getColor());
        car.setDescription(carDto.getDescription());

        car.setStatus(Status.DRAFT);
        car.setSeller(user);

        Car savedCar = carRepo.save(car);

        if (images != null && images.length > 0) {
            try {
                List<String> imageUrls = imageStorageService.storeImages(images);
                for (String url : imageUrls) {
                    CarImage carImage = new CarImage();
                    carImage.setCar(savedCar);
                    carImage.setImageUrl(url);
                    carImageRepository.save(carImage);
                }
            } catch (IOException e) {
                throw new RuntimeException("Failed to store images", e);
            }
        }

        return savedCar;
    }

    @Override
    public void listForDirectSale(Long carId, Long sellerId) {
        Car car = carRepo.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        if (!car.getSeller().getId().equals(sellerId)) {
            throw new RuntimeException("You are not the owner of this car");
        }
        if (car.getStatus() != Status.AVAILABLE) {
            throw new RuntimeException("Car must be approved and available first");
        }

        car.setSaleType(SaleType.DIRECT);
        carRepo.save(car);
    }

    @Override
    public void submitForApproval(Long carId, Long sellerId) {

        Car car = carRepo.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        if (!car.getSeller().getId().equals(sellerId)) {
            throw new RuntimeException("Unauthorized");
        }

        if (car.getStatus() != Status.DRAFT) {
            throw new RuntimeException("Only DRAFT cars can be submitted");
        }

        car.setStatus(Status.PENDING_APPROVAL);
        carRepo.save(car);
    }


    @Override
    public List<CarResponseDTO> getPendingCars() {
        return carRepo.findByStatus(Status.PENDING_APPROVAL)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Car approveCar(Long carId) {

        Car car = carRepo.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        if (car.getStatus() != Status.PENDING_APPROVAL) {
            throw new RuntimeException("Car is not pending approval");
        }

        car.setStatus(Status.AVAILABLE);
        return carRepo.save(car);
    }

    @Override
    public Car rejectCar(Long carId) {

        Car car = carRepo.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        if (car.getStatus() != Status.PENDING_APPROVAL) {
            throw new RuntimeException("Car is not pending approval");
        }

        car.setStatus(Status.CANCELLED);
        return carRepo.save(car);
    }

    @Override
    public List<CarResponseDTO> getAllAvailableCars() {
        return carRepo.findBySaleTypeAndStatus(SaleType.DIRECT, Status.AVAILABLE)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CarResponseDTO> getAllCars() {
        return carRepo.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }


    private CarResponseDTO convertToDto(Car car) {

        CarResponseDTO dto = new CarResponseDTO();

        dto.setId(car.getId());
        dto.setRegistrationNo(car.getRegistrationNo());
        dto.setBrand(car.getBrand());
        dto.setManufacturer(car.getManufacturer());
        dto.setModel(car.getModel());
        dto.setManufactureYear(car.getManufactureYear());
        dto.setFuelType(car.getFuelType());
        dto.setTransmission(car.getTransmission());
        dto.setKmDriven(car.getKmDriven());
        dto.setMileage(car.getMileage());
        dto.setColor(car.getColor());
        dto.setEngineCc(car.getEngineCc());
        dto.setPrice(car.getPrice());
        dto.setDescription(car.getDescription());
        dto.setSaleType(car.getSaleType());
        dto.setStatus(car.getStatus());

        dto.setImages(car.getImages());
        
        User seller = car.getSeller();
        if (seller != null) {
            dto.setSellerName(seller.getFirstName()+" "+seller.getLastName());  
            dto.setSellerEmail(seller.getEmail());
            dto.setSellerPhone(seller.getPhone());
        }
        
        return dto;


}
}
