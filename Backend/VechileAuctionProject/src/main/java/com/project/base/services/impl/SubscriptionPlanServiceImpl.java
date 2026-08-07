package com.project.base.services.impl;

import com.project.base.pojo.PlanName;
import com.project.base.pojo.SubscriptionPlan;
import com.project.base.repository.SubscriptionPlanRepository;
import com.project.base.services.SubscriptionPlanService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubscriptionPlanServiceImpl implements SubscriptionPlanService {

    @Autowired
    private SubscriptionPlanRepository planRepository;

    @Override
    public List<SubscriptionPlan> getAllPlans() {
        return planRepository.findAll();
    }

    @Override
    public SubscriptionPlan getPlanByName(PlanName planName) {
        return planRepository.findByPlanName(planName)
                .orElseThrow(() ->
                        new RuntimeException("Subscription plan not found: " + planName));
    }
}
