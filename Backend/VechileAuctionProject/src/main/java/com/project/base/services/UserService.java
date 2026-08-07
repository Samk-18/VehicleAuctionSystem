package com.project.base.services;

import java.util.List;
import java.util.Set;

import com.project.base.dto.UserDTO;
import com.project.base.exception.ApiException;
import com.project.base.pojo.User;
import com.project.base.pojo.UserStatus;

public interface UserService {

    String registerUser(UserDTO userDto) throws ApiException;

    User getCurrentUser(); 

    List<User> getAllUsers();

    void updateUserStatus(Long userId, UserStatus status);

    void promoteToAdmin(Long userId);

    void resetPassword(String email, String otp, String newPassword) throws ApiException;
    
    void blockUser(Long userId);
    
    void unblockUser(Long userId);
    
    void deleteUser(Long userId);
    
    void updateUserRoles(Long userId, Set<String> roleNames);
}
