package com.fitness.tracker.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.Map;

/**
 * Response DTO for user registration trend data.
 */
@Data
@Builder
public class UserRegistrationTrendResponse {

    private LocalDate date;
    private Long count;
}