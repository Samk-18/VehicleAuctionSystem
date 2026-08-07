package com.project.base.services;

import com.project.base.pojo.VehicleCategory;
import java.math.BigDecimal;

public class DepositPolicy {
    public static BigDecimal getDepositAmount(VehicleCategory category) {
        return category == VehicleCategory.BIKE_SCOOTER
                ? BigDecimal.valueOf(10000)
                : BigDecimal.valueOf(25000);
    }
}