package com.fitness.tracker.user.service.impl;

import com.fitness.tracker.user.entity.Role;

import com.fitness.tracker.common.enums.ErrorCode;
import com.fitness.tracker.exception.BusinessException;
import com.fitness.tracker.exception.EntityNotFoundException;
import com.fitness.tracker.user.dto.UserResponse;
import com.fitness.tracker.user.dto.UserStatsResponse;
import com.fitness.tracker.user.dto.UserUpdateRequest;
import com.fitness.tracker.user.entity.User;
import com.fitness.tracker.user.repository.UserRepository;
import com.fitness.tracker.user.service.UserService;
import com.fitness.tracker.workout.repository.WorkoutRepository;
import com.fitness.tracker.goal.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

/**
 * Implementation of user service operations.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final WorkoutRepository workoutRepository;
    private final GoalRepository goalRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Override
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BusinessException(ErrorCode.TOKEN_MISSING, "No authenticated user found");
        }

        String username = authentication.getName();
        return userRepository.findByUsernameWithRoles(username)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "User not found"));
    }

    @Override
    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND,
                        String.format("User not found with id: %d", id)));
    }

    @Override
    public UserResponse getUserProfile(Long userId) {
        User user = getUserById(userId);
        validateUserAccess(user);

        return mapToUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateUserProfile(Long userId, UserUpdateRequest request) {
        User user = getUserById(userId);
        validateUserAccess(user);

        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getAge() != null) {
            user.setAge(request.getAge());
        }
        if (request.getGender() != null) {
            user.setGender(request.getGender());
        }
        if (request.getHeight() != null) {
            user.setHeight(request.getHeight());
        }
        if (request.getWeight() != null) {
            user.setWeight(request.getWeight());
        }
        if (request.getProfilePictureUrl() != null) {
            user.setProfilePictureUrl(request.getProfilePictureUrl());
        }

        User savedUser = userRepository.save(user);
        log.info("User profile updated: {}", userId);

        return mapToUserResponse(savedUser);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = getUserById(userId);
        validateUserAccess(user);

        userRepository.delete(user);
        log.info("User account deleted: {}", userId);
    }

    @Override
    @Transactional
    public void changePassword(Long userId, com.fitness.tracker.user.dto.ChangePasswordRequest request) {
        User user = getUserById(userId);
        validateUserAccess(user);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS, "Current password does not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Password changed successfully for user: {}", userId);
    }

    @Override
    public UserStatsResponse getUserStats(Long userId) {
        User user = getUserById(userId);
        validateUserAccess(user);

        Long totalWorkouts = workoutRepository.countByUserId(userId);
        Long activeGoals = goalRepository.countByUserId(userId);
        Long completedGoals = goalRepository.countCompletedGoals();

        return UserStatsResponse.builder()
                .totalWorkouts(totalWorkouts != null ? totalWorkouts : 0L)
                .totalCaloriesBurned(0L)
                .totalDurationMinutes(0L)
                .activeGoals(activeGoals)
                .completedGoals(completedGoals)
                .workoutsThisMonth(0L)
                .caloriesThisMonth(0L)
                .build();
    }

    @Override
    public boolean userExists(Long userId) {
        return userRepository.existsById(userId);
    }

    /**
     * Validate that current user has access to the target user.
     */
    private void validateUserAccess(User targetUser) {
        User currentUser = getCurrentUser();

        // Admin can access all users
        boolean isAdmin = currentUser.getRoles().stream()
                .anyMatch(role -> role.getName() == Role.RoleName.ROLE_ADMIN);
//                .anyMatch(role -> role.getName() == User.RoleName.ROLE_ADMIN);

        if (!isAdmin && !currentUser.getId().equals(targetUser.getId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED, "You can only access your own profile");
        }
    }

    /**
     * Map User entity to UserResponse DTO.
     */
    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .age(user.getAge())
                .gender(user.getGender())
                .height(user.getHeight())
                .weight(user.getWeight())
                .profilePictureUrl(user.getProfilePictureUrl())
                .roles(user.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(Collectors.toSet()))
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
