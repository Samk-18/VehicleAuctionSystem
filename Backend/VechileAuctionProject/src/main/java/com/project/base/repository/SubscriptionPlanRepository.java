package com.project.base.repository;

import com.project.base.pojo.PlanName;
import com.project.base.pojo.SubscriptionPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SubscriptionPlanRepository
        extends JpaRepository<SubscriptionPlan, Long> {

    Optional<SubscriptionPlan> findByPlanName(PlanName planName);
}
