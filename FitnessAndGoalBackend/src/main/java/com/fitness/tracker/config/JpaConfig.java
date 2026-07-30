package com.fitness.tracker.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * JPA Configuration class.
 */
@Configuration
@EnableJpaAuditing
@EnableJpaRepositories(basePackages = "com.fitness.tracker")
@EnableTransactionManagement
public class JpaConfig {
}
