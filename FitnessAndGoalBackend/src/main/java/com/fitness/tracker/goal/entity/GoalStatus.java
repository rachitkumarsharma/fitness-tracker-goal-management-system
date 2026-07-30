package com.fitness.tracker.goal.entity;

import lombok.Getter;

/**
 * Enumeration of goal statuses.
 */
@Getter
public enum GoalStatus {

    NOT_STARTED("Not Started", "Goal has not been started yet"),
    IN_PROGRESS("In Progress", "Goal is in progress"),
    ACTIVE("Active", "Goal is currently active"),
    COMPLETED("Completed", "Goal has been achieved");

    private final String displayName;
    private final String description;

    GoalStatus(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }
}

