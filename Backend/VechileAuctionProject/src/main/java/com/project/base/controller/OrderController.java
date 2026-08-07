package com.project.base.controller;

import com.project.base.pojo.Order;
import com.project.base.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/my")
    public ResponseEntity<?> getMyOrders(Authentication auth) {
        List<Order> orders = orderService.getOrdersByUser(auth.getName());
        return ResponseEntity.ok(orders);
    }
}
