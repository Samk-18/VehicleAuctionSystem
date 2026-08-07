package com.project.base.services.impl;

import com.project.base.pojo.Order;
import com.project.base.pojo.User;
import com.project.base.repository.OrderRepository;
import com.project.base.repository.UserRepository;
import com.project.base.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepo;
    private final UserRepository userRepo;

    @Override
    public List<Order> getOrdersByUser(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderRepo.findByUser(user);
    }
}
