//package com.project.base.services.impl;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.project.base.pojo.User;
//import com.project.base.repository.UserRepository;
//import com.project.base.security.MyUserDetails;
//
//@Service
//public class CustomUserDetailsService implements UserDetailsService {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Override
//    @Transactional(readOnly = true)
//    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//
//        // 1. Fetch user from DB by email
//        // We use @Transactional to ensure the roles (Lazy loaded) are fetched correctly
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() -> 
//                        new UsernameNotFoundException("User not found with email: " + email));
//
//        // 2. Map the Roles to SimpleGrantedAuthority
//        // Since your RoleName is an Enum (ROLE_ADMIN, ROLE_BUYER, etc.), name() gives the string
//        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
//                .map(role -> new SimpleGrantedAuthority(role.getRoleName().name()))
//                .collect(Collectors.toList());
//
//        // 3. Return MyUserDetails
//        // Ensure your MyUserDetails constructor matches this, or simply pass 'user' 
//        // if MyUserDetails handles the mapping internally.
//        return new MyUserDetails(user);
//    }
//}