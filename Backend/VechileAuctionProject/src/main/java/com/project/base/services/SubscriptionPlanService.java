package com.project.base.services;

import com.project.base.pojo.PlanName;
import com.project.base.pojo.SubscriptionPlan;

import java.util.List;

public interface SubscriptionPlanService {

    List<SubscriptionPlan> getAllPlans();

    SubscriptionPlan getPlanByName(PlanName planName);
}
	