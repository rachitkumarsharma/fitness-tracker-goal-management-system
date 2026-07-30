package com.fitness.tracker.exception;

import com.fitness.tracker.common.enums.ErrorCode;

/**
 * Exception thrown for authentication/authorization failures.
 */
public class UnauthorizedException extends BusinessException {

    public UnauthorizedException(ErrorCode errorCode) {
        super(errorCode);
    }

    public UnauthorizedException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }

    public UnauthorizedException(String message) {
        super(ErrorCode.ACCESS_DENIED, message);
    }
}
