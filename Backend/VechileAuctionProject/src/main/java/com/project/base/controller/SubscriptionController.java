package com.project.base.controller;

import java.util.List;

import com.project.base.pojo.PlanName;
import com.project.base.pojo.SubscriptionPlan;
import com.project.base.pojo.UserSubscription;
import com.project.base.services.SubscriptionService;
import com.project.base.services.SubscriptionPlanService;
import com.project.base.services.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private SubscriptionPlanService subscriptionPlanService;

    @Autowired
    private UserService userService;

    
    @GetMapping("/plans")
    public ResponseEntity<List<SubscriptionPlan>> viewPlans() {
        return ResponseEntity.ok(
            subscriptionPlanService.getAllPlans()
        );
    }

    
    @PostMapping("/buy/{planName}")
    @PreAuthorize("hasAnyAuthority('ROLE_BUYER','ROLE_SELLER')")
    public ResponseEntity<UserSubscription> buyPlan(
            @PathVariable PlanName planName) {

        Long userId = userService.getCurrentUser().getId();
        return ResponseEntity.ok(
                subscriptionService.subscribeUser(userId, planName)
        );
    }

    
    @GetMapping("/me")
    @PreAuthorize("hasAuthority('ROLE_BUYER') or hasAuthority('ROLE_SELLER')")  
    public ResponseEntity<UserSubscription> mySubscription() {

        Long userId = userService.getCurrentUser().getId();
        return ResponseEntity.ok(
                subscriptionService.getActiveSubscription(userId)
        );
    }
}
