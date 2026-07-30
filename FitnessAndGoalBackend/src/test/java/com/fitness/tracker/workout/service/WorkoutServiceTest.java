package com.fitness.tracker.workout.service;

import com.fitness.tracker.user.entity.User;
import com.fitness.tracker.user.service.UserService;
import com.fitness.tracker.workout.dto.WorkoutRequest;
import com.fitness.tracker.workout.dto.WorkoutResponse;
import com.fitness.tracker.workout.entity.Workout;
import com.fitness.tracker.workout.entity.WorkoutType;
import com.fitness.tracker.workout.repository.WorkoutRepository;
import com.fitness.tracker.workout.service.impl.WorkoutServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WorkoutServiceTest {

    @Mock
    private WorkoutRepository workoutRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private WorkoutServiceImpl workoutService;

    private User testUser;
    private Workout testWorkout;
    private WorkoutRequest workoutRequest;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .build();

        testWorkout = Workout.builder()
                .id(1L)
                .user(testUser)
                .workoutType("CARDIO")
                .exerciseName("Morning Run")
                .duration(45)
                .calories(350.0)
                .distance(5.5)
                .workoutDate(LocalDate.now())
                .build();

        workoutRequest = new WorkoutRequest();
        workoutRequest.setWorkoutType("CARDIO");
        workoutRequest.setExerciseName("Morning Run");
        workoutRequest.setDuration(45);
        workoutRequest.setCalories(350.0);
        workoutRequest.setDistance(5.5);
        workoutRequest.setWorkoutDate(LocalDate.now());
    }

    @Test
    @DisplayName("Should create workout successfully")
    void createWorkout_Success() {
        when(userService.getCurrentUser()).thenReturn(testUser);
        when(workoutRepository.save(any(Workout.class))).thenReturn(testWorkout);

        WorkoutResponse response = workoutService.createWorkout(workoutRequest);

        assertNotNull(response);
        assertEquals("CARDIO", response.getWorkoutType());
        assertEquals("Morning Run", response.getExerciseName());
        assertEquals(45, response.getDuration());
        assertEquals(350.0, response.getCalories());

        verify(workoutRepository).save(any(Workout.class));
    }

    @Test
    @DisplayName("Should return workouts with pagination")
    void getWorkouts_Pagination() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Workout> workoutPage = new PageImpl<>(List.of(testWorkout));

        when(userService.getCurrentUserId()).thenReturn(1L);
        when(workoutRepository.findByUserId(1L, pageable)).thenReturn(workoutPage);

        var response = workoutService.getWorkouts(pageable);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
        assertEquals(0, response.getPage());
        assertEquals(1, response.getTotalElements());
    }

    @Test
    @DisplayName("Should get workout by ID")
    void getWorkoutById_Success() {
        when(userService.getCurrentUserId()).thenReturn(1L);
        when(workoutRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testWorkout));

        WorkoutResponse response = workoutService.getWorkoutById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Morning Run", response.getExerciseName());
    }
}
