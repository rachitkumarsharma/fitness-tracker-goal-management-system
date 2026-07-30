package com.fitness.tracker.security.service;

import com.fitness.tracker.common.enums.ErrorCode;
import com.fitness.tracker.exception.BusinessException;
import com.fitness.tracker.security.config.JwtConfig;
import com.fitness.tracker.security.entity.RefreshToken;
import com.fitness.tracker.security.repository.RefreshTokenRepository;
import com.fitness.tracker.user.entity.User;
import com.fitness.tracker.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

/**
 * Service for managing refresh tokens.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final JwtConfig jwtConfig;

    /**
     * Create a new refresh token for user.
     */
    @Transactional
    public RefreshToken createRefreshToken(User user) {
        // Revoke all existing tokens for user (single session)
        // Comment out for multiple sessions support
        // refreshTokenRepository.revokeAllByUserId(user.getId());

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(generateRefreshTokenValue())
                .expiresAt(LocalDateTime.now().plusSeconds(jwtConfig.getRefreshExpiration() / 1000))
                .revoked(false)
                .build();

        RefreshToken savedToken = refreshTokenRepository.save(refreshToken);
        log.debug("Created refresh token for user: {}", user.getUsername());
        return savedToken;
    }

    /**
     * Find refresh token by token string.
     */
    public RefreshToken findByToken(String token) {
        return refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new BusinessException(ErrorCode.REFRESH_TOKEN_INVALID,
                        "Refresh token not found"));
    }

    /**
     * Validate refresh token.
     */
    public void validateRefreshToken(RefreshToken token) {
        if (!token.isValid()) {
            if (Boolean.TRUE.equals(token.getRevoked())) {
                throw new BusinessException(ErrorCode.REFRESH_TOKEN_INVALID,
                        "Refresh token has been revoked");
            }
            if (token.isExpired()) {
                throw new BusinessException(ErrorCode.REFRESH_TOKEN_INVALID,
                        "Refresh token has expired");
            }
        }
    }

    /**
     * Verify refresh token and return user.
     */
    @Transactional
    public User verifyRefreshToken(String token) {
        RefreshToken refreshToken = findByToken(token);
        validateRefreshToken(refreshToken);

        return refreshToken.getUser();
    }

    /**
     * Revoke refresh token.
     */
    @Transactional
    public void revokeRefreshToken(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(refreshToken -> {
            refreshToken.setRevoked(true);
            refreshTokenRepository.save(refreshToken);
            log.debug("Revoked refresh token");
        });
    }

    /**
     * Revoke all refresh tokens for user.
     */
    @Transactional
    public void revokeAllUserTokens(Long userId) {
        refreshTokenRepository.revokeAllByUserId(userId);
        log.debug("Revoked all refresh tokens for user: {}", userId);
    }

    /**
     * Delete refresh token.
     */
    @Transactional
    public void deleteByUser(User user) {
        refreshTokenRepository.deleteByUser(user);
        log.debug("Deleted refresh tokens for user: {}", user.getUsername());
    }

    /**
     * Delete refresh token by token value.
     */
    @Transactional
    public void deleteByToken(String token) {
        refreshTokenRepository.deleteByToken(token);
    }

    /**
     * Clean up expired tokens (scheduled task).
     */
    @Scheduled(cron = "0 0 2 * * ?") // Run at 2 AM daily
    @Transactional
    public void cleanupExpiredTokens() {
        log.info("Cleaning up expired refresh tokens");
        refreshTokenRepository.deleteExpiredTokens(LocalDateTime.now());
    }

    /**
     * Generate a unique refresh token value.
     */
    private String generateRefreshTokenValue() {
        return java.util.UUID.randomUUID().toString();
    }
}
