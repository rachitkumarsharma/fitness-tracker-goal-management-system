package com.fitness.tracker.workout.enums;

/**
 * Enumeration of workout intensity levels.
 */
public enum Intensity {

    LOW("Low"),
    MODERATE("Moderate"),
    HIGH("High"),
    VERY_HIGH("Very High");

    private final String displayName;

    Intensity(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
