package com.project.base.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.base.pojo.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
	
}
