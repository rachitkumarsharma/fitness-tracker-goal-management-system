package com.fitness.tracker.workout.entity;

import lombok.Getter;

/**
 * Enumeration of supported workout types.
 * These represent meaningful fitness activities, NOT muscle groups.
 * Muscle groups (Chest, Back, Biceps, etc.) are used only for API Ninjas exercise filtering.
 */
@Getter
public enum WorkoutType {

    RUNNING("Running", "km"),
    CYCLING("Cycling", "km"),
    SWIMMING("Swimming", "meters"),
    WEIGHT_LIFTING("Weight Lifting", "sets"),
    YOGA("Yoga", "minutes"),
    HIIT("High-Intensity Interval Training", "minutes"),
    WALKING("Walking", "km"),
    CARDIO("Cardio", "minutes"),
    CROSSFIT("CrossFit", "minutes"),
    PILATES("Pilates", "minutes"),
    OTHER("Other", "units");

    private final String displayName;
    private final String defaultUnit;

    WorkoutType(String displayName, String defaultUnit) {
        this.displayName = displayName;
        this.defaultUnit = defaultUnit;
    }
}

