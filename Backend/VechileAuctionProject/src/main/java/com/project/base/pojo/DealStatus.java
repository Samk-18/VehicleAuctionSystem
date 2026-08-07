package com.project.base.pojo;

public enum DealStatus {
    PENDING,              // waiting on seller confirmation and/or buyer deposit
    CONTACT_UNLOCKED,     // deposit paid + seller confirmed — contact shared, remaining balance now due
    COMPLETED,  // remaining balance paid — deal fully settled
    FORFEITED,            // buyer failed to pay deposit within 24h
    DECLINED_BY_SELLER,   // seller declined — refund issued if buyer already paid
    EXPIRED
}
