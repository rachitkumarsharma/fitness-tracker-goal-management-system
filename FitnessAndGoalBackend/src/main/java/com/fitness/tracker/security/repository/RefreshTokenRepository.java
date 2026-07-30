package com.fitness.tracker.security.repository;

import com.fitness.tracker.security.entity.RefreshToken;
import com.fitness.tracker.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Repository for RefreshToken entity operations.
 */
@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    /**
     * Find refresh token by token string.
     */
    Optional<RefreshToken> findByToken(String token);

    /**
     * Find refresh token by user.
     */
    Optional<RefreshToken> findByUser(User user);

    /**
     * Check if token exists.
     */
    boolean existsByToken(String token);

    /**
     * Delete refresh token by token.
     */
    void deleteByToken(String token);

    /**
     * Delete all refresh tokens for a user.
     */
    void deleteByUser(User user);

    /**
     * Revoke all tokens for a user.
     */
    @Modifying
    @Query("UPDATE RefreshToken rt SET rt.revoked = true WHERE rt.user.id = :userId")
    void revokeAllByUserId(@Param("userId") Long userId);

    /**
     * Delete expired tokens.
     */
    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.expiresAt < :now")
    void deleteExpiredTokens(@Param("now") LocalDateTime now);

    /**
     * Count active tokens for user.
     */
    @Query("SELECT COUNT(rt) FROM RefreshToken rt WHERE rt.user.id = :userId AND rt.revoked = false AND rt.expiresAt > :now")
    Long countActiveTokensByUserId(@Param("userId") Long userId, @Param("now") LocalDateTime now);
}
