package com.project.base.services;

import com.project.base.pojo.Order;

import java.util.List;

public interface OrderService {
    List<Order> getOrdersByUser(String email);
}
