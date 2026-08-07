package com.project.base.services.impl;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.base.dto.AuthRequestDto;
import com.project.base.dto.AuthResponseDto;
import com.project.base.dto.BuyerRegisterDto;
import com.project.base.dto.SellerRegisterDto;
import com.project.base.pojo.OtpPurpose;
import com.project.base.pojo.Role;
import com.project.base.pojo.RoleName;
import com.project.base.pojo.SellerProfile;
import com.project.base.pojo.SellerType;
import com.project.base.pojo.User;
import com.project.base.repository.RoleRepository;
import com.project.base.repository.SellerProfileRepository;
import com.project.base.repository.UserRepository;
import com.project.base.security.JwtUtil;
import com.project.base.services.AuthService;
import com.project.base.services.OtpService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {
		
	@Autowired
	private OtpService otpService;
	
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final SellerProfileRepository sellerProfileRepository;

    private static final String EMAIL_REGEX =
            "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";

    private static final String PASSWORD_REGEX =
            "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).{7,}$";

    private static final String AADHAAR_REGEX = "^\\d{12}$";
    private static final String PAN_REGEX = "^[A-Z]{5}[0-9]{4}[A-Z]$";
    // DL formats vary a lot by state — this is intentionally permissive.
    // Tighten it later if you want strict state-code validation.
    private static final String DL_REGEX = "^[A-Z0-9-]{10,16}$";

    private boolean isValidIdProof(String value) {
        if (value == null) return false;
        String v = value.trim().toUpperCase();
        return v.matches(AADHAAR_REGEX) || v.matches(PAN_REGEX);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponseDto authenticate(AuthRequestDto request) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getPassword()
                        )
                );

        String token = jwtUtil.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        Set<String> roleNames = user.getRoles().stream()
                .map(r -> r.getRoleName().name())
                .collect(Collectors.toSet());

        String role;
        if (roleNames.contains("ROLE_ADMIN")) {
            role = "ROLE_ADMIN";
        } else if (roleNames.contains("ROLE_SELLER")) {
            role = "ROLE_SELLER";
        } else if (roleNames.contains("ROLE_BUYER")) {
            role = "ROLE_BUYER";
        } else {
            role = "ROLE_UNKNOWN";
        }

        return new AuthResponseDto(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                role,
                token,
                "Login successful"
        );
    }

    @Override
    public void register(User user) {

        // Normalise email
        String email = user.getEmail() == null ? "" : user.getEmail().trim().toLowerCase();
        user.setEmail(email);

        if (!email.matches(EMAIL_REGEX)) {
            throw new RuntimeException("Invalid email format.");
        }

        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("An account with this email already exists.");
        }

        if (user.getPassword() == null || !user.getPassword().matches(PASSWORD_REGEX)) {
            throw new RuntimeException(
                "Password must be at least 7 characters and include 1 uppercase letter, 1 number, and 1 symbol."
            );
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getPhone() == null || !user.getPhone().matches("^[6-9]\\d{9}$")) {
            throw new RuntimeException("Phone number must be exactly 10 digits and start with 6-9.");
        }

        Role buyerRole = roleRepository
                .findByRoleName(RoleName.ROLE_BUYER)
                .orElseThrow(() -> new RuntimeException("ROLE_BUYER not found"));

        user.setRoles(Set.of(buyerRole));
        userRepository.save(user);
    }

    @Override
    public void registerBuyer(BuyerRegisterDto dto) {
    	
    	otpService.verifyOtp(dto.getEmail(), dto.getOtp(), OtpPurpose.REGISTRATION);
    	
        String email = dto.getEmail() == null ? "" : dto.getEmail().trim().toLowerCase();

        if (!email.matches(EMAIL_REGEX)) {
            throw new RuntimeException("Invalid email format.");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("An account with this email already exists.");
        }
        if (dto.getPassword() == null || !dto.getPassword().equals(dto.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match.");
        }
        if (!dto.getPassword().matches(PASSWORD_REGEX)) {
            throw new RuntimeException(
                "Password must be at least 7 characters and include 1 uppercase letter, 1 number, and 1 symbol.");
        }
        if (dto.getPhone() == null || !dto.getPhone().matches("^[6-9]\\d{9}$")) {
            throw new RuntimeException("Phone number must be exactly 10 digits and start with 6-9.");
        }
        if (!dto.isAgreeTerms() || !dto.isAgreePrivacy()) {
            throw new RuntimeException("You must accept the Terms & Conditions and Privacy Policy.");
        }

        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setPhone(dto.getPhone());

        StringBuilder addr = new StringBuilder();
        if (dto.getCity() != null && !dto.getCity().isBlank()) addr.append(dto.getCity());
        if (dto.getState() != null && !dto.getState().isBlank())
            addr.append(addr.length() > 0 ? ", " : "").append(dto.getState());
        if (dto.getPincode() != null && !dto.getPincode().isBlank())
            addr.append(addr.length() > 0 ? " - " : "").append(dto.getPincode());
        user.setAddress(addr.toString());

        Role buyerRole = roleRepository.findByRoleName(RoleName.ROLE_BUYER)
                .orElseThrow(() -> new RuntimeException("ROLE_BUYER not found"));
        user.setRoles(Set.of(buyerRole));

        userRepository.save(user);
    }

    @Override
    public void registerSeller(SellerRegisterDto dto) {

    	otpService.verifyOtp(dto.getEmail(), dto.getOtp(), OtpPurpose.REGISTRATION);
    	
        String email = dto.getEmail() == null ? "" : dto.getEmail().trim().toLowerCase();

        if (!email.matches(EMAIL_REGEX)) {
            throw new RuntimeException("Invalid email format.");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("An account with this email already exists.");
        }
        if (dto.getPassword() == null || !dto.getPassword().equals(dto.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match.");
        }
        if (!dto.getPassword().matches(PASSWORD_REGEX)) {
            throw new RuntimeException(
                "Password must be at least 7 characters and include 1 uppercase letter, 1 number, and 1 symbol.");
        }
        if (dto.getPhone() == null || !dto.getPhone().matches("^[6-9]\\d{9}$")) {
            throw new RuntimeException("Phone number must be exactly 10 digits and start with 6-9.");
        }
        if (!isValidIdProof(dto.getIdProofNumber())) {
            throw new RuntimeException("Enter a valid Aadhaar (12 digits) or PAN (e.g. ABCDE1234F).");
        }
        if (dto.getDrivingLicenseNumber() == null
                || !dto.getDrivingLicenseNumber().trim().toUpperCase().matches(DL_REGEX)) {
            throw new RuntimeException("Enter a valid Driving License number.");
        }
        if (!dto.isAgreeTerms() || !dto.isAgreePrivacy()) {
            throw new RuntimeException("You must accept the Terms & Conditions and Privacy Policy.");
        }
        if (sellerProfileRepository.existsByIdProofNumber(dto.getIdProofNumber().trim().toUpperCase())) {
            throw new RuntimeException("This Aadhaar/PAN number is already registered to another account.");
        }
        if (sellerProfileRepository.existsByDrivingLicenseNumber(dto.getDrivingLicenseNumber().trim().toUpperCase())) {
            throw new RuntimeException("This Driving License number is already registered to another account.");
        }
        
        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setPhone(dto.getPhone());
        user.setAddress(dto.getHouseStreet() + ", " + dto.getCity() + ", " + dto.getState() + " - " + dto.getPincode());

        // Immediate ROLE_SELLER grant — no admin approval, per your spec
        Role sellerRole = roleRepository.findByRoleName(RoleName.ROLE_SELLER)
                .orElseThrow(() -> new RuntimeException("ROLE_SELLER not found"));
        user.setRoles(Set.of(sellerRole));

        User savedUser = userRepository.save(user);

        SellerProfile profile = new SellerProfile();
        profile.setUser(savedUser);
        profile.setIdProofNumber(dto.getIdProofNumber().trim().toUpperCase());
        profile.setDrivingLicenseNumber(dto.getDrivingLicenseNumber().trim().toUpperCase());
        profile.setSellerType(dto.getSellerType() == null ? SellerType.INDIVIDUAL : dto.getSellerType());
        profile.setDealerName(dto.getDealerName());

        sellerProfileRepository.save(profile);
    }
}
