package com.project.base.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.base.dto.ApiResponse;
import com.project.base.dto.CarResponseDTO;
import com.project.base.dto.CartResponseDTO;
import com.project.base.pojo.Car;
import com.project.base.pojo.Cart;
import com.project.base.pojo.CartItem;
import com.project.base.pojo.User;
import com.project.base.repository.CarRepository;
import com.project.base.repository.CartRepository;
import com.project.base.repository.UserRepository;
import com.project.base.services.CartService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
@Transactional
public class CartServiceImpl implements CartService {

    private final UserRepository userRepo;
    private final CarRepository carRepo;
    private final CartRepository cartRepo;

    @Override
    public ApiResponse addToCart(Long carId, String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Car car = carRepo.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        Cart cart = cartRepo.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepo.save(newCart);
                });

        boolean alreadyExists = cart.getItems().stream()
                .anyMatch(item -> item.getCar().getId().equals(carId));

        if (alreadyExists)
            throw new RuntimeException("Car already in cart");

        CartItem item = new CartItem();
        item.setCart(cart);
        item.setCar(car);
        item.setPriceAtAddTime(car.getPrice());

        cart.getItems().add(item);
        cartRepo.save(cart);

        return new ApiResponse("Added to Cart");
    }

    @Override
    public CartResponseDTO getMyCart(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepo.findByUser(user)
                .orElse(new Cart()); 

        List<CarResponseDTO> cars = cart.getItems().stream()
                .map(item -> {
                    Car car = item.getCar();
                    User seller = car.getSeller(); 

                    return new CarResponseDTO(
                            car.getId(),
                            car.getRegistrationNo(),
                            car.getBrand(),
                            car.getManufacturer(),
                            car.getModel(),
                            car.getStatus(),
                            car.getManufactureYear(),
                            car.getFuelType(),
                            car.getTransmission(),
                            car.getKmDriven(),
                            car.getMileage(),
                            car.getColor(),
                            car.getEngineCc(),
                            item.getPriceAtAddTime(),
                            car.getDescription(),
                            car.getSaleType(),
                            car.getImages(), 
                            seller.getFirstName(),
                            seller.getEmail(),
                            seller.getPhone(),
                            item.getId()
                            
                    );
                })
                .toList();

        double totalAmount = cart.getItems().stream()
                .mapToDouble(CartItem::getPriceAtAddTime)
                .sum();
        

        return new CartResponseDTO(cart.getId(), cars, totalAmount);    }
    	
    
    @Override
    public ApiResponse removeFromCart(Long cartItemId, String email) {
    	 User user = userRepo.findByEmail(email)
    	            .orElseThrow(() -> new RuntimeException("User not found"));

    	    Cart cart = cartRepo.findByUser(user)
    	            .orElseThrow(() -> new RuntimeException("Cart not found"));

    	    boolean removed = cart.getItems().removeIf(item -> item.getId().equals(cartItemId));

    	    if (!removed) {
    	        throw new RuntimeException("Cart item not found");
    	    }

    	    cartRepo.save(cart);
        return new ApiResponse("Item Removed From Cart");
    }
  
    

}
