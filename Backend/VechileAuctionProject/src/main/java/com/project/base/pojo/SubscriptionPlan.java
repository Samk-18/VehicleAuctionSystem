package com.project.base.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "subscription_plans")
@Getter
@Setter
@NoArgsConstructor 
public class SubscriptionPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "plan_id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "plan_name", unique = true, nullable = false)
    private PlanName planName;

    private double price;

    @Column(name = "total_bids")
    private int totalBids;

    @Column(name = "bids_per_auction")
    private int bidsPerAuction;

    @Column(name = "validity_days", nullable = false)
    private int validityDays;

    public SubscriptionPlan(
            PlanName planName,
            double price,
            int totalBids,
            int bidsPerAuction,
            int validityDays) {

        this.planName = planName;
        this.price = price;
        this.totalBids = totalBids;
        this.bidsPerAuction = bidsPerAuction;
        this.validityDays = validityDays;
    }
}
