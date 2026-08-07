package com.project.base.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.project.base.pojo.PlanName;
import com.project.base.pojo.SubscriptionPlan;
import com.project.base.repository.SubscriptionPlanRepository;

@Component
@Transactional
public class SubscriptionPlanInitializer implements CommandLineRunner {

    private final SubscriptionPlanRepository planRepository;

    public SubscriptionPlanInitializer(SubscriptionPlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    @Override
    public void run(String... args) {

        if (planRepository.count() == 0) {

            planRepository.save(
                new SubscriptionPlan(PlanName.BASIC, 499, 20, 3, 30)
            );

            planRepository.save(
                new SubscriptionPlan(PlanName.PREMIUM, 999, 100, 10, 90)
            );

            System.out.println("✅ Subscription plans initialized");
        }
    }
}
