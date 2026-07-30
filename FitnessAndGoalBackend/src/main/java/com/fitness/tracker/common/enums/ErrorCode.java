package com.fitness.tracker.common.enums;

import lombok.Getter;

/**
 * Error codes for consistent error responses across the application.
 */
@Getter
public enum ErrorCode {

    // Authentication errors (AUTH-001 to AUTH-010)
    INVALID_CREDENTIALS("AUTH-001", "Invalid username or password", 401),
    TOKEN_EXPIRED("AUTH-002", "JWT token has expired", 401),
    TOKEN_INVALID("AUTH-003", "Invalid JWT token", 401),
    TOKEN_MISSING("AUTH-004", "Authorization token is required", 401),
    REFRESH_TOKEN_INVALID("AUTH-005", "Invalid or expired refresh token", 401),
    ACCOUNT_DISABLED("AUTH-006", "Account is disabled", 403),
    ACCOUNT_LOCKED("AUTH-007", "Account is locked", 403),
    ACCESS_DENIED("AUTH-008", "Access denied", 403),

    // User errors (USER-001 to USER-020)
    USER_NOT_FOUND("USER-001", "User not found", 404),
    EMAIL_ALREADY_EXISTS("USER-002", "Email address already registered", 409),
    USERNAME_ALREADY_EXISTS("USER-003", "Username already taken", 409),
    USER_UPDATE_FAILED("USER-004", "Failed to update user", 500),
    USER_DELETE_FAILED("USER-005", "Failed to delete user", 500),

    // Role errors (ROLE-001 to ROLE-010)
    ROLE_NOT_FOUND("ROLE-001", "Role not found", 404),
    ROLE_ALREADY_ASSIGNED("ROLE-002", "Role already assigned to user", 400),
    ROLE_NOT_ASSIGNED("ROLE-003", "Role not assigned to user", 400),

    // Workout errors (WORKOUT-001 to WORKOUT-020)
    WORKOUT_NOT_FOUND("WORKOUT-001", "Workout not found", 404),
    WORKOUT_ACCESS_DENIED("WORKOUT-002", "You do not have access to this workout", 403),
    WORKOUT_CREATE_FAILED("WORKOUT-003", "Failed to create workout", 500),
    WORKOUT_UPDATE_FAILED("WORKOUT-004", "Failed to update workout", 500),
    WORKOUT_DELETE_FAILED("WORKOUT-005", "Failed to delete workout", 500),

    // Goal errors (GOAL-001 to GOAL-020)
    GOAL_NOT_FOUND("GOAL-001", "Goal not found", 404),
    GOAL_ACCESS_DENIED("GOAL-002", "You do not have access to this goal", 403),
    GOAL_CREATE_FAILED("GOAL-003", "Failed to create goal", 500),
    GOAL_UPDATE_FAILED("GOAL-004", "Failed to update goal", 500),
    GOAL_DELETE_FAILED("GOAL-005", "Failed to delete goal", 500),
    GOAL_ALREADY_COMPLETED("GOAL-006", "Goal is already completed", 400),
    GOAL_ALREADY_FAILED("GOAL-007", "Goal has already expired", 400),

    // Validation errors (VAL-001 to VAL-010)
    VALIDATION_ERROR("VAL-001", "Validation failed", 400),
    INVALID_INPUT("VAL-002", "Invalid input data", 400),
    MISSING_REQUIRED_FIELD("VAL-003", "Required field is missing", 400),

    // General errors (GEN-001 to GEN-010)
    INTERNAL_ERROR("GEN-001", "Internal server error", 500),
    ENTITY_NOT_FOUND("GEN-002", "Requested resource not found", 404),
    ILLEGAL_OPERATION("GEN-003", "Illegal operation", 400),
    DATABASE_ERROR("GEN-004", "Database operation failed", 500);

    private final String code;
    private final String message;
    private final int httpStatus;

    ErrorCode(String code, String message, int httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
