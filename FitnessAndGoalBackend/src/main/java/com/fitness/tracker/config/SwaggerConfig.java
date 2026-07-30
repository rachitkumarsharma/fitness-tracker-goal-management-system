package com.fitness.tracker.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Swagger/OpenAPI Configuration.
 */
@Configuration
public class SwaggerConfig {

    @Value("${server.port:8080}")
    private int serverPort;

    @Bean
    public OpenAPI fitnessTrackerOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .info(apiInfo())
                .servers(List.of(
                        new Server().url("/api").description("API Server")
                ))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter JWT Bearer token")
                        )
                )
                .addSecurityItem(new io.swagger.v3.oas.models.security.SecurityRequirement()
                        .addList(securitySchemeName));
    }

    private Info apiInfo() {
        return new Info()
                .title("Fitness Tracker API")
                .description("""
                        ## Production-Level Fitness Tracker and Goal Management System

                        A comprehensive REST API for tracking fitness activities and managing fitness goals.

                        ### Features
                        - User registration and authentication with JWT
                        - Workout tracking with multiple types
                        - Fitness goal management with progress tracking
                        - Statistics and reporting

                        ### Authentication
                        All endpoints (except /auth/**) require JWT authentication.
                        Include the JWT token in the Authorization header as: `Bearer <token>`

                        ### Rate Limits
                        - Standard tier: 100 requests/minute
                        - Premium tier: 500 requests/minute
                        """)
                .version("1.0.0")
                .contact(new Contact()
                        .name("Fitness Tracker Team")
                        .email("support@fitnesstracker.com")
                        .url("https://fitnesstracker.com"))
                .license(new License()
                        .name("Apache 2.0")
                        .url("https://www.apache.org/licenses/LICENSE-2.0"));
    }
}
