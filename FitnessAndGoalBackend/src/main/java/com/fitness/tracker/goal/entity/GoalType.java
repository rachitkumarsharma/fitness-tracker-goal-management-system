package com.fitness.tracker.goal.entity;

import lombok.Getter;

/**
 * Enumeration of supported goal types.
 */
@Getter
public enum GoalType {

    WEIGHT_LOSS("Weight Loss"),
    WEIGHT_GAIN("Weight Gain"),
    MUSCLE_GAIN("Muscle Gain"),
    FLEXIBILITY("Flexibility"),
    CARDIO("Cardio"),
    STRENGTH("Strength"),
    BODY_FAT_REDUCTION("Body Fat Reduction"),
    CUSTOM("Custom");

    private final String displayName;

    GoalType(String displayName) {
        this.displayName = displayName;
    }
}

