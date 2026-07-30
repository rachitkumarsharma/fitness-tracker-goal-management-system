package com.fitness.tracker.workout.service.impl;

import com.fitness.tracker.common.enums.ErrorCode;
import com.fitness.tracker.exception.EntityNotFoundException;
import com.fitness.tracker.user.entity.User;
import com.fitness.tracker.user.service.UserService;
import com.fitness.tracker.workout.dto.WorkoutListResponse;
import com.fitness.tracker.workout.dto.WorkoutRequest;
import com.fitness.tracker.workout.dto.WorkoutResponse;
import com.fitness.tracker.workout.entity.Workout;
import com.fitness.tracker.workout.repository.WorkoutRepository;
import com.fitness.tracker.workout.service.WorkoutService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of workout service operations.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class WorkoutServiceImpl implements WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final UserService userService;

    @Override
    @Transactional
    public WorkoutResponse createWorkout(WorkoutRequest request) {
        User currentUser = userService.getCurrentUser();

        Workout workout = Workout.builder()
                .user(currentUser)
                .workoutType(request.getWorkoutType())
                .muscle(request.getMuscle())
                .exerciseName(request.getExerciseName())
                .equipment(request.getEquipment())
                .difficulty(request.getDifficulty())
                .sets(request.getSets())
                .reps(request.getReps())
                .weight(request.getWeight())
                .distance(request.getDistance())
                .calories(request.getCalories())
                .duration(request.getDuration())
                .notes(request.getNotes())
                .build();

        Workout savedWorkout = workoutRepository.save(workout);
        log.info("Workout created: {} for user: {}", savedWorkout.getId(), currentUser.getId());

        return mapToWorkoutResponse(savedWorkout);
    }

    @Override
    public WorkoutResponse getWorkoutById(Long workoutId) {
        Long userId = userService.getCurrentUserId();
        Workout workout = workoutRepository.findByIdAndUserId(workoutId, userId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.WORKOUT_NOT_FOUND,
                        String.format("Workout not found with id: %d", workoutId)));

        return mapToWorkoutResponse(workout);
    }

    @Override
    public WorkoutListResponse getWorkouts(Pageable pageable) {
        Long userId = userService.getCurrentUserId();
        Page<Workout> workoutPage = workoutRepository.findByUserId(userId, pageable);

        List<WorkoutResponse> workouts = workoutPage.getContent().stream()
                .map(this::mapToWorkoutResponse)
                .collect(Collectors.toList());

        return WorkoutListResponse.builder()
                .content(workouts)
                .page(workoutPage.getNumber())
                .size(workoutPage.getSize())
                .totalElements(workoutPage.getTotalElements())
                .totalPages(workoutPage.getTotalPages())
                .first(workoutPage.isFirst())
                .last(workoutPage.isLast())
                .build();
    }

    @Override
    public WorkoutListResponse getWorkoutsByType(String type, Pageable pageable) {
        Long userId = userService.getCurrentUserId();
        Page<Workout> workoutPage = workoutRepository.findByUserIdAndWorkoutType(userId, type, pageable);

        List<WorkoutResponse> workouts = workoutPage.getContent().stream()
                .map(this::mapToWorkoutResponse)
                .collect(Collectors.toList());

        return WorkoutListResponse.builder()
                .content(workouts)
                .page(workoutPage.getNumber())
                .size(workoutPage.getSize())
                .totalElements(workoutPage.getTotalElements())
                .totalPages(workoutPage.getTotalPages())
                .first(workoutPage.isFirst())
                .last(workoutPage.isLast())
                .build();
    }

    @Override
    @Transactional
    public WorkoutResponse updateWorkout(Long workoutId, WorkoutRequest request) {
        Long userId = userService.getCurrentUserId();
        Workout workout = workoutRepository.findByIdAndUserId(workoutId, userId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.WORKOUT_NOT_FOUND,
                        String.format("Workout not found with id: %d", workoutId)));

        if (request.getWorkoutType() != null) workout.setWorkoutType(request.getWorkoutType());
        if (request.getMuscle() != null) workout.setMuscle(request.getMuscle());
        if (request.getExerciseName() != null) workout.setExerciseName(request.getExerciseName());
        if (request.getEquipment() != null) workout.setEquipment(request.getEquipment());
        if (request.getDifficulty() != null) workout.setDifficulty(request.getDifficulty());
        if (request.getSets() != null) workout.setSets(request.getSets());
        if (request.getReps() != null) workout.setReps(request.getReps());
        if (request.getWeight() != null) workout.setWeight(request.getWeight());
        if (request.getDistance() != null) workout.setDistance(request.getDistance());
        if (request.getCalories() != null) workout.setCalories(request.getCalories());
        if (request.getDuration() != null) workout.setDuration(request.getDuration());
        if (request.getNotes() != null) workout.setNotes(request.getNotes());

        Workout updatedWorkout = workoutRepository.save(workout);
        log.info("Workout updated: {} for user: {}", workoutId, userId);

        return mapToWorkoutResponse(updatedWorkout);
    }

    @Override
    @Transactional
    public void deleteWorkout(Long workoutId) {
        Long userId = userService.getCurrentUserId();

        Workout workout = workoutRepository.findByIdAndUserId(workoutId, userId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.WORKOUT_NOT_FOUND,
                        String.format("Workout not found with id: %d", workoutId)));

        workoutRepository.delete(workout);
        log.info("Workout deleted: {} for user: {}", workoutId, userId);
    }

    @Override
    public List<WorkoutResponse> getRecentWorkouts(int limit) {
        Long userId = userService.getCurrentUserId();
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Workout> workouts = workoutRepository.findByUserId(userId, pageable);

        return workouts.stream()
                .map(this::mapToWorkoutResponse)
                .collect(Collectors.toList());
    }

    /**
     * Map Workout entity to WorkoutResponse DTO.
     */
    private WorkoutResponse mapToWorkoutResponse(Workout workout) {
        return WorkoutResponse.builder()
                .id(workout.getId())
                .userId(workout.getUser().getId())
                .workoutType(workout.getWorkoutType())
                .workoutTypeName(workout.getWorkoutTypeName())
                .muscle(workout.getMuscle())
                .exerciseName(workout.getExerciseName())
                .equipment(workout.getEquipment())
                .difficulty(workout.getDifficulty())
                .sets(workout.getSets())
                .reps(workout.getReps())
                .weight(workout.getWeight())
                .distance(workout.getDistance())
                .calories(workout.getCalories())
                .duration(workout.getDuration())
                .notes(workout.getNotes())
                .workoutDate(workout.getWorkoutDate())
                .createdAt(workout.getCreatedAt())
                .updatedAt(workout.getUpdatedAt())
                .build();
    }
}

