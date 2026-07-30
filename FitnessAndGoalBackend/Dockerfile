FROM eclipse-temurin:17-jdk-jammy as builder

WORKDIR /app

# Copy maven files
COPY pom.xml .
COPY src ./src

# Build application
RUN apt-get update && apt-get install -y maven
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Create non-root user
RUN groupadd -r fitness && useradd -r -g fitness fitness

# Copy JAR from builder
COPY --from=builder /app/target/*.jar app.jar

# Set ownership
RUN chown -R fitness:fitness /app

# Switch to non-root user
USER fitness

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/api/actuator/health || exit 1

# Entry point
ENTRYPOINT ["java", "-jar", "app.jar"]
