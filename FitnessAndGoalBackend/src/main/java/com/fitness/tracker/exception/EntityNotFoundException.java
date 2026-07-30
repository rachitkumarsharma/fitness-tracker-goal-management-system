package com.fitness.tracker.exception;

import com.fitness.tracker.common.enums.ErrorCode;

/**
 * Exception thrown when an entity is not found.
 */
public class EntityNotFoundException extends BusinessException {

    public EntityNotFoundException(String entityName, Long id) {
        super(ErrorCode.ENTITY_NOT_FOUND,
                String.format("%s not found with id: %d", entityName, id));
    }

    public EntityNotFoundException(String message) {
        super(ErrorCode.ENTITY_NOT_FOUND, message);
    }

    public EntityNotFoundException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }
}
