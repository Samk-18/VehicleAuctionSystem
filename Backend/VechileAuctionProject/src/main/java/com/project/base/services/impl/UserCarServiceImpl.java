package com.project.base.services.impl;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.project.base.dto.ApiResponse;
import com.project.base.dto.CarDto;
import com.project.base.dto.CarResponseDTO;
import com.project.base.pojo.Car;
import com.project.base.pojo.CarImage;
import com.project.base.pojo.Status;
import com.project.base.pojo.User;
import com.project.base.repository.AuctionRepository;
import com.project.base.repository.CarRepository;
import com.project.base.repository.CartItemRepository;
import com.project.base.repository.UserRepository;
import com.project.base.services.ImageStorageService;
import com.project.base.services.UserCarService;

@Service
@Transactional
public class UserCarServiceImpl implements UserCarService{

	 @Autowired
	    private CarRepository carRepo;

	    @Autowired
	    private UserRepository userRepo;

	    @Autowired
	    private ImageStorageService carImageService;
	    
	    @Autowired
	    private CartItemRepository cartItemRepo;

	    @Autowired
	    private AuctionRepository auctionRepo;

	    @Override
	    public ApiResponse deleteCar(Long carId, Long sellerId) {
	        Car car = carRepo.findById(carId)
	                .orElseThrow(() -> new RuntimeException("Car not found"));

	        if (!car.getSeller().getId().equals(sellerId)) {
	            throw new RuntimeException("You are not authorized to delete this car");
	        }
	        if (car.getStatus() == Status.UNDER_AUCTION) {
	            throw new RuntimeException("Cannot delete a car that is currently under auction");
	        }
	        if (car.getStatus() == Status.SOLD) {
	            throw new RuntimeException("Cannot delete a car that has already been sold");
	        }

	        // Always safe to clean up — just a cart reference, no historical value
	        cartItemRepo.deleteAllByCarId(carId);

	        // Check BEFORE attempting delete, instead of delete-then-catch
	        boolean hasAuctionHistory = auctionRepo.existsByCarId(carId);

	        if (hasAuctionHistory) {
	            // Soft delete — preserves the auction record for admin's "All Auctions" history
	            car.setStatus(Status.REMOVED);
	            carRepo.save(car);
	            return new ApiResponse("Car removed from your listings (auction history preserved)");
	        }

	        carRepo.delete(car);
	        return new ApiResponse("Car deleted successfully");
	    }

	    @Override
	    public List<CarResponseDTO> getCarsBySeller(Long sellerId) {

	        List<Car> cars = carRepo.findBySellerIdAndStatusNot(sellerId, Status.REMOVED);

	        return cars.stream().map(car -> {
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
	                dto.setSellerName(seller.getFirstName() + " " + seller.getLastName());
	                dto.setSellerEmail(seller.getEmail());
	                dto.setSellerPhone(seller.getPhone());
	            }
	            return dto;
	        }).collect(Collectors.toList());
	    }
}
