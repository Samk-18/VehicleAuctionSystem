package com.project.base.services.impl;

import com.project.base.dto.UserDTO;
import com.project.base.exception.ApiException;
import com.project.base.pojo.OtpPurpose;
import com.project.base.pojo.Role;
import com.project.base.pojo.RoleName;
import com.project.base.pojo.User;
import com.project.base.pojo.UserStatus;
import com.project.base.repository.AuctionRepository;
import com.project.base.repository.CarRepository;
import com.project.base.repository.CartItemRepository;
import com.project.base.repository.CartRepository;
import com.project.base.repository.PaymentRepository;
import com.project.base.repository.RoleRepository;
import com.project.base.repository.SellerProfileRepository;
import com.project.base.repository.UserRepository;
import com.project.base.security.MyUserDetails;
import com.project.base.services.OtpService;
import com.project.base.services.UserService;

import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service; // ✅ CRITICAL IMPORT

@Service
@Transactional 
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository; 

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private CarRepository carRepository;
    
    @Autowired
    private AuctionRepository auctionRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private CartItemRepository cartItemRepo;
    
    @Autowired
    private SellerProfileRepository sellerProfileRepository;
    
    @Autowired
    private OtpService otpService;
    
    @Override
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof MyUserDetails) {
            return ((MyUserDetails) authentication.getPrincipal()).getUser();
        }
        return null;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public void promoteToAdmin(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Role adminRole = roleRepository.findByRoleName(RoleName.ROLE_ADMIN)
            .orElseThrow(() -> new RuntimeException("Role ROLE_ADMIN not found in database"));

        user.getRoles().add(adminRole);

        userRepository.save(user);
    }

    @Override
    public void resetPassword(String email, String otp, String newPassword) throws ApiException {

        otpService.verifyOtp(email, otp, OtpPurpose.PASSWORD_RESET);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public void updateUserStatus(Long userId, UserStatus status) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(status);
        userRepository.save(user);
    }

    @Override
    public String registerUser(UserDTO userDto) {
        return "User Registered";
    }
    
    @Override
    public void blockUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(UserStatus.INACTIVE);
        userRepository.save(user);
    }

    @Override
    public void unblockUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
    }

    @Override
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }

        boolean hasCars = carRepository.existsBySellerId(userId);
        boolean hasWonAuctions = auctionRepository.existsByWinnerId(userId);
        boolean hasPayments = paymentRepository.existsByUserId(userId);

        if (hasCars || hasWonAuctions || hasPayments) {
            throw new RuntimeException(
                "This user has cars, auctions, or payment history and can't be permanently deleted. " +
                "Use Block instead to disable their account without losing records."
            );
        }

        cartItemRepo.deleteAllByCartUserId(userId);
        cartRepository.deleteByUserId(userId);
        sellerProfileRepository.deleteByUserId(userId);

        userRepository.deleteById(userId);
    }
    
    @Override
    public void updateUserRoles(Long userId, Set<String> roleNames) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Set<Role> newRoles = roleNames.stream()
            .map(name -> roleRepository.findByRoleName(RoleName.valueOf(name))
                .orElseThrow(() -> new RuntimeException("Role not found: " + name)))
            .collect(Collectors.toSet());

        user.setRoles(newRoles);
        userRepository.save(user);
    }
    
    
}