package com.fitness.tracker.security.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * JWT configuration properties.
 */
@Data
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtConfig {

    /**
     * Secret key for signing JWT tokens.
     */
    private String secret;

    /**
     * Access token expiration time in milliseconds.
     */
    private Long expiration = 3600000L; // 1 hour default

    /**
     * Refresh token expiration time in milliseconds.
     */
    private Long refreshExpiration = 86400000L; // 24 hours default

    /**
     * JWT issuer.
     */
    private String issuer = "fitness-tracker";

    /**
     * Get secret key as byte array.
     */
    public byte[] getSecretKey() {
        return secret.getBytes();
    }
}
