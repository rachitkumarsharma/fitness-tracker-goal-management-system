package com.fitness.tracker.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Application-wide configuration.
 */
@Configuration
@EnableAsync
@EnableCaching
@EnableScheduling
public class AppConfig {
}
