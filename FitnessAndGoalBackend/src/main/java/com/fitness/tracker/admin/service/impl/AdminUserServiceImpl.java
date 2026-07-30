package com.fitness.tracker.admin.service.impl;

import com.fitness.tracker.admin.dto.AdminUserResponse;
import com.fitness.tracker.admin.dto.AdminUserUpdateRequest;
import com.fitness.tracker.admin.dto.AssignRoleRequest;
import com.fitness.tracker.admin.service.AdminUserService;
import com.fitness.tracker.common.enums.ErrorCode;
import com.fitness.tracker.exception.BusinessException;
import com.fitness.tracker.exception.EntityNotFoundException;
import com.fitness.tracker.user.entity.Role;
import com.fitness.tracker.user.entity.User;
import com.fitness.tracker.user.repository.RoleRepository;
import com.fitness.tracker.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Implementation of admin user service operations.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<AdminUserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::mapToAdminUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AdminUserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND,
                        String.format("User not found with id: %d", userId)));
        return mapToAdminUserResponse(user);
    }

    @Override
    public List<AdminUserResponse> searchUsers(String username, String email) {
        List<User> users;
        if (username == null && email == null) {
            users = userRepository.findAll();
        } else if (username == null) {
            users = userRepository.findByEmailContainingIgnoreCase(email);
        } else if (email == null) {
            users = userRepository.findByUsernameContainingIgnoreCase(username);
        } else {
            users = userRepository.findByUsernameContainingOrEmailContaining(username, email);
        }
        return users.stream()
                .map(this::mapToAdminUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AdminUserResponse> getUsersByRole(String roleName) {
        Role.RoleName roleEnum;
        try {
            roleEnum = Role.RoleName.valueOf(roleName);
        } catch (IllegalArgumentException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "Invalid role name: " + roleName);
        }
        List<User> users = userRepository.findByRoles_Name(roleEnum);
        return users.stream()
                .map(this::mapToAdminUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AdminUserResponse updateUser(Long userId, AdminUserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND,
                        String.format("User not found with id: %d", userId)));

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getProfilePictureUrl() != null) {
            user.setProfilePictureUrl(request.getProfilePictureUrl());
        }
        if (request.getEnabled() != null) {
            user.setEnabled(request.getEnabled());
        }
        if (request.getAccountNonLocked() != null) {
            user.setAccountNonLocked(request.getAccountNonLocked());
        }

        User savedUser = userRepository.save(user);
        log.info("Admin updated user: {}", userId);

        return mapToAdminUserResponse(savedUser);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND,
                        String.format("User not found with id: %d", userId)));

        // Prevent admin from deleting themselves? Optional, but we can allow.
        userRepository.delete(user);
        log.info("Admin deleted user: {}", userId);
    }

    @Override
    @Transactional
    public void blockUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND,
                        String.format("User not found with id: %d", userId)));
        user.setEnabled(false);
        userRepository.save(user);
        log.info("Admin blocked user: {}", userId);
    }

    @Override
    @Transactional
    public void unblockUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND,
                        String.format("User not found with id: %d", userId)));
        user.setEnabled(true);
        userRepository.save(user);
        log.info("Admin unblocked user: {}", userId);
    }

    @Override
    @Transactional
    public void suspendUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND,
                        String.format("User not found with id: %d", userId)));
        user.setEnabled(false);
        userRepository.save(user);
        log.info("Admin suspended user: {}", userId);
    }

    @Override
    @Transactional
    public void activateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND,
                        String.format("User not found with id: %d", userId)));
        user.setEnabled(true);
        userRepository.save(user);
        log.info("Admin activated user: {}", userId);
    }

    @Override
    public String resetPassword(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND,
                        String.format("User not found with id: %d", userId)));

        // Generate a temporary password
        String tempPassword = generateTempPassword();
        String encodedPassword = passwordEncoder.encode(tempPassword);
        user.setPassword(encodedPassword);
        // Also reset the credentials non expired flag? Not necessary, but we can set to true.
        user.setCredentialsNonExpired(true);
        userRepository.save(user);
        log.info("Admin reset password for user: {}", userId);
        return tempPassword;
    }

    @Override
    @Transactional
    public void assignRole(Long userId, AssignRoleRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND,
                        String.format("User not found with id: %d", userId)));

        Role.RoleName roleName;
        try {
            roleName = Role.RoleName.valueOf(request.getRoleName());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "Invalid role name: " + request.getRoleName());
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.ROLE_NOT_FOUND,
                        "Role not found: " + request.getRoleName()));

        // Check if user already has the role
        if (user.getRoles().contains(role)) {
            throw new BusinessException(ErrorCode.ROLE_ALREADY_ASSIGNED,
                    "User already has role: " + request.getRoleName());
        }

        user.addRole(role);
        userRepository.save(user);
        log.info("Admin assigned role {} to user {}", roleName, userId);
    }

    @Override
    @Transactional
    public void removeRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND,
                        String.format("User not found with id: %d", userId)));

        Role.RoleName roleEnum;
        try {
            roleEnum = Role.RoleName.valueOf(roleName);
        } catch (IllegalArgumentException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "Invalid role name: " + roleName);
        }

        Role role = roleRepository.findByName(roleEnum)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.ROLE_NOT_FOUND,
                        "Role not found: " + roleName));

        // Check if user has the role
        if (!user.getRoles().contains(role)) {
            throw new BusinessException(ErrorCode.ROLE_NOT_ASSIGNED,
                    "User does not have role: " + roleName);
        }

        // Prevent removing the last role? We'll allow, but note that a user without roles may not be able to access anything.
        user.removeRole(role);
        userRepository.save(user);
        log.info("Admin removed role {} from user {}", roleName, userId);
    }

    /**
     * Map User entity to AdminUserResponse DTO.
     */
    private AdminUserResponse mapToAdminUserResponse(User user) {
        return AdminUserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .profilePictureUrl(user.getProfilePictureUrl())
                .roles(user.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(Collectors.toSet()))
                .enabled(user.getEnabled())
                .accountNonExpired(user.getAccountNonExpired())
                .accountNonLocked(user.getAccountNonLocked())
                .credentialsNonExpired(user.getCredentialsNonExpired())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    /**
     * Generate a temporary password.
     * In a real application, you might want to use a more secure method.
     * @return temporary password
     */
    private String generateTempPassword() {
        // Generate a random 10-character password
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        StringBuilder sb = new StringBuilder();
        java.util.Random random = new java.util.Random();
        for (int i = 0; i < 10; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}