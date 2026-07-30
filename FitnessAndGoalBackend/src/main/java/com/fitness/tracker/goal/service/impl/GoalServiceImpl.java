package com.fitness.tracker.goal.service.impl;

import com.fitness.tracker.common.enums.ErrorCode;
import com.fitness.tracker.exception.BusinessException;
import com.fitness.tracker.exception.EntityNotFoundException;
import com.fitness.tracker.goal.dto.GoalListResponse;
import com.fitness.tracker.goal.dto.GoalRequest;
import com.fitness.tracker.goal.dto.GoalResponse;
import com.fitness.tracker.goal.entity.Goal;
import com.fitness.tracker.goal.entity.GoalStatus;
import com.fitness.tracker.goal.entity.GoalType;
import com.fitness.tracker.goal.repository.GoalRepository;
import com.fitness.tracker.goal.service.GoalService;
import com.fitness.tracker.user.entity.User;
import com.fitness.tracker.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of goal service operations.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class GoalServiceImpl implements GoalService {

    private final GoalRepository goalRepository;
    private final UserService userService;

    @Override
    @Transactional
    public GoalResponse createGoal(GoalRequest request) {
        User currentUser = userService.getCurrentUser();

        GoalStatus status = GoalStatus.NOT_STARTED;
        if (request.getStatus() != null) {
            try {
                status = GoalStatus.valueOf(request.getStatus());
            } catch (IllegalArgumentException e) {
                status = GoalStatus.NOT_STARTED;
            }
        }

        Goal goal = Goal.builder()
                .user(currentUser)
                .goalType(request.getGoalType())
                .title(request.getTitle())
                .description(request.getDescription())
                .target(request.getTarget())
                .progress(request.getProgress())
                .targetValue(request.getTargetValue())
                .currentValue(request.getCurrentValue() != null ? request.getCurrentValue() : 0.0)
                .startDate(request.getStartDate())
                .targetDate(request.getTargetDate())
                .status(status)
                .build();

        Goal savedGoal = goalRepository.save(goal);
        log.info("Goal created: {} for user: {}", savedGoal.getId(), currentUser.getId());

        return mapToGoalResponse(savedGoal);
    }

    @Override
    public GoalResponse getGoalById(Long goalId) {
        Long userId = userService.getCurrentUserId();

        Goal goal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.GOAL_NOT_FOUND,
                        String.format("Goal not found with id: %d", goalId)));

        return mapToGoalResponse(goal);
    }

    @Override
    public GoalListResponse getGoals(Pageable pageable) {
        Long userId = userService.getCurrentUserId();
        Page<Goal> goalPage = goalRepository.findByUserId(userId, pageable);

        List<GoalResponse> goals = goalPage.getContent().stream()
                .map(this::mapToGoalResponse)
                .collect(Collectors.toList());

        return GoalListResponse.builder()
                .content(goals)
                .page(goalPage.getNumber())
                .size(goalPage.getSize())
                .totalElements(goalPage.getTotalElements())
                .totalPages(goalPage.getTotalPages())
                .first(goalPage.isFirst())
                .last(goalPage.isLast())
                .build();
    }

    @Override
    public GoalListResponse getGoalsByStatus(GoalStatus status, Pageable pageable) {
        Long userId = userService.getCurrentUserId();
        Page<Goal> goalPage = goalRepository.findByUserIdAndStatus(userId, status, pageable);

        List<GoalResponse> goals = goalPage.getContent().stream()
                .map(this::mapToGoalResponse)
                .collect(Collectors.toList());

        return GoalListResponse.builder()
                .content(goals)
                .page(goalPage.getNumber())
                .size(goalPage.getSize())
                .totalElements(goalPage.getTotalElements())
                .totalPages(goalPage.getTotalPages())
                .first(goalPage.isFirst())
                .last(goalPage.isLast())
                .build();
    }

    @Override
    public GoalListResponse getGoalsByType(GoalType type, Pageable pageable) {
        Long userId = userService.getCurrentUserId();
        Page<Goal> goalPage = goalRepository.findByUserIdAndGoalType(userId, type, pageable);

        List<GoalResponse> goals = goalPage.getContent().stream()
                .map(this::mapToGoalResponse)
                .collect(Collectors.toList());

        return GoalListResponse.builder()
                .content(goals)
                .page(goalPage.getNumber())
                .size(goalPage.getSize())
                .totalElements(goalPage.getTotalElements())
                .totalPages(goalPage.getTotalPages())
                .first(goalPage.isFirst())
                .last(goalPage.isLast())
                .build();
    }

    @Override
    @Transactional
    public GoalResponse updateGoal(Long goalId, GoalRequest request) {
        Long userId = userService.getCurrentUserId();
        Goal goal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.GOAL_NOT_FOUND,
                        String.format("Goal not found with id: %d", goalId)));

        // Check if goal is already completed
        if (goal.getStatus() == GoalStatus.COMPLETED) {
            throw new BusinessException(ErrorCode.GOAL_ALREADY_COMPLETED,
                    "Cannot update a completed goal");
        }

        if (request.getGoalType() != null) goal.setGoalType(request.getGoalType());
        if (request.getTitle() != null) goal.setTitle(request.getTitle());
        if (request.getDescription() != null) goal.setDescription(request.getDescription());
        if (request.getTarget() != null) goal.setTarget(request.getTarget());
        if (request.getProgress() != null) goal.setProgress(request.getProgress());
        if (request.getTargetValue() != null) goal.setTargetValue(request.getTargetValue());
        if (request.getCurrentValue() != null) goal.setCurrentValue(request.getCurrentValue());
        if (request.getStartDate() != null) goal.setStartDate(request.getStartDate());
        if (request.getTargetDate() != null) goal.setTargetDate(request.getTargetDate());
        if (request.getStatus() != null) {
            try {
                goal.setStatus(GoalStatus.valueOf(request.getStatus()));
            } catch (IllegalArgumentException e) {
                // ignore invalid status
            }
        }

        Goal updatedGoal = goalRepository.save(goal);
        log.info("Goal updated: {} for user: {}", goalId, userId);

        return mapToGoalResponse(updatedGoal);
    }

    @Override
    @Transactional
    public GoalResponse updateGoalProgress(Long goalId, String progress) {
        Goal goal = goalRepository.findByIdAndUserId(goalId, userService.getCurrentUserId())
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.GOAL_NOT_FOUND,
                        String.format("Goal not found with id: %d", goalId)));

        if (goal.getStatus() == GoalStatus.COMPLETED) {
            throw new BusinessException(ErrorCode.GOAL_ALREADY_COMPLETED,
                    "Cannot update progress on a completed goal");
        }

        goal.setProgress(progress);

        Goal updatedGoal = goalRepository.save(goal);
        return mapToGoalResponse(updatedGoal);
    }

    @Override
    @Transactional
    public GoalResponse updateGoalStatus(Long goalId, GoalStatus status) {
        Long userId = userService.getCurrentUserId();
        Goal goal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.GOAL_NOT_FOUND,
                        String.format("Goal not found with id: %d", goalId)));

        goal.setStatus(status);
        Goal updatedGoal = goalRepository.save(goal);
        log.info("Goal status updated: {} -> {} for user: {}", goalId, status, userId);

        return mapToGoalResponse(updatedGoal);
    }

    @Override
    @Transactional
    public void deleteGoal(Long goalId) {
        Long userId = userService.getCurrentUserId();

        Goal goal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.GOAL_NOT_FOUND,
                        String.format("Goal not found with id: %d", goalId)));

        goalRepository.delete(goal);
        log.info("Goal deleted: {} for user: {}", goalId, userId);
    }

    @Override
    public List<GoalResponse> getExpiringGoals(int days) {
        Long userId = userService.getCurrentUserId();
        LocalDate expiryDate = LocalDate.now().plusDays(days);

        List<Goal> goals = goalRepository.findExpiringGoals(userId, expiryDate);

        return goals.stream()
                .map(this::mapToGoalResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void completeAchievedGoals() {
        // No auto-complete logic needed with String-based progress
        log.info("Auto-complete is disabled with simplified goal model");
    }

    /**
     * Map Goal entity to GoalResponse DTO.
     */
    private GoalResponse mapToGoalResponse(Goal goal) {
        return GoalResponse.builder()
                .id(goal.getId())
                .userId(goal.getUser().getId())
                .goalType(goal.getGoalType())
                .goalTypeName(goal.getGoalTypeName())
                .title(goal.getTitle())
                .description(goal.getDescription())
                .target(goal.getTarget())
                .progress(goal.getProgress())
                .targetValue(goal.getTargetValue())
                .currentValue(goal.getCurrentValue())
                .startDate(goal.getStartDate())
                .targetDate(goal.getTargetDate())
                .status(goal.getStatus())
                .createdAt(goal.getCreatedAt())
                .updatedAt(goal.getUpdatedAt())
                .build();
    }
}

