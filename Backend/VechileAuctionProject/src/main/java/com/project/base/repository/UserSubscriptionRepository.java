package com.project.base.repository;

import com.project.base.pojo.OrderItem;
import com.project.base.pojo.SubscriptionStatus;
import com.project.base.pojo.User;
import com.project.base.pojo.UserSubscription;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserSubscriptionRepository
        extends JpaRepository<UserSubscription, Long> {

    List<UserSubscription> findAllByUserAndStatus(
            User user,
            SubscriptionStatus status
    );

    Optional<UserSubscription> findFirstByUserAndStatus(
            User user,
            SubscriptionStatus status
    );
    @Modifying
    @Transactional
    @Query("""
        UPDATE UserSubscription us
        SET us.status = :expired
        WHERE us.user.id = :userId
          AND us.status = :active
    """)
    void deactivateActiveSubscriptions(Long userId,
                                       SubscriptionStatus active,
                                       SubscriptionStatus expired);

    List<UserSubscription> findByUserAndStatus(User user, SubscriptionStatus status);


}
