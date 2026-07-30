# Fitness Tracker and Goal Management System

start project - mvn spring-boot:run

A production-grade REST API for tracking fitness activities and managing fitness goals, built with Java Spring Boot, MySQL, and JWT authentication.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Request/Response Examples](#requestresponse-examples)
- [Database Schema](#database-schema)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Deployment](#deployment)

## Features

- **User Management**: Registration, authentication, profile management
- **Workout Tracking**: Log and manage workout activities
- **Goal Management**: Set and track fitness goals with progress monitoring
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Role-Based Access Control**: User and Admin roles
- **Comprehensive Validation**: Input validation on all endpoints
- **Global Exception Handling**: Consistent error responses
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Statistics**: User activity statistics and reports

## Technology Stack

| Component         | Technology        | Version |
| ----------------- | ----------------- | ------- |
| Language          | Java              | 17      |
| Framework         | Spring Boot       | 3.2.5   |
| Database          | MySQL             | 8.0+    |
| ORM               | Spring Data JPA   | 3.2.x   |
| Security          | Spring Security   | 6.2.x   |
| Authentication    | JWT (jjwt)        | 0.12.5  |
| Build Tool        | Maven             | 3.9.x   |
| API Documentation | SpringDoc OpenAPI | 2.4.0   |

## Project Structure

```
com.fitness.tracker
├── FitnessTrackerApplication.java       # Main entry point
│
├── auth/                                 # Authentication Module
│   ├── controller/AuthController.java
│   ├── dto/
│   │   ├── LoginRequest.java
│   │   ├── LoginResponse.java
│   │   ├── RegisterRequest.java
│   │   └── RefreshTokenRequest.java
│   └── service/
│       ├── AuthService.java
│       └── impl/AuthServiceImpl.java
│
├── user/                                 # User Module
│   ├── controller/UserController.java
│   ├── dto/
│   │   ├── UserResponse.java
│   │   ├── UserUpdateRequest.java
│   │   └── UserStatsResponse.java
│   ├── entity/
│   │   ├── User.java
│   │   └── Role.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   └── RoleRepository.java
│   └── service/
│       ├── UserService.java
│       └── impl/UserServiceImpl.java
│
├── workout/                              # Workout Module
│   ├── controller/WorkoutController.java
│   ├── dto/
│   │   ├── WorkoutRequest.java
│   │   ├── WorkoutResponse.java
│   │   └── WorkoutListResponse.java
│   ├── entity/
│   │   ├── Workout.java
│   │   └── WorkoutType.java
│   ├── repository/WorkoutRepository.java
│   └── service/
│       ├── WorkoutService.java
│       └── impl/WorkoutServiceImpl.java
│
├── goal/                                 # Goal Module
│   ├── controller/GoalController.java
│   ├── dto/
│   │   ├── GoalRequest.java
│   │   ├── GoalResponse.java
│   │   ├── GoalProgressRequest.java
│   │   └── GoalListResponse.java
│   ├── entity/
│   │   ├── Goal.java
│   │   ├── GoalType.java
│   │   └── GoalStatus.java
│   ├── repository/GoalRepository.java
│   └── service/
│       ├── GoalService.java
│       └── impl/GoalServiceImpl.java
│
├── security/                             # Security Module
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   └── JwtConfig.java
│   ├── filter/JwtAuthenticationFilter.java
│   ├── handler/JwtAuthenticationEntryPoint.java
│   ├── jwt/JwtTokenProvider.java
│   ├── entity/RefreshToken.java
│   ├── repository/RefreshTokenRepository.java
│   └── service/
│       ├── RefreshTokenService.java
│       └── UserDetailsServiceImpl.java
│
├── exception/                            # Exception Handling
│   ├── BusinessException.java
│   ├── EntityNotFoundException.java
│   ├── UnauthorizedException.java
│   ├── ErrorResponse.java
│   └── GlobalExceptionHandler.java
│
├── common/                               # Common Utilities
│   ├── entity/BaseEntity.java
│   └── enums/ErrorCode.java
│
└── config/                               # Configuration
    ├── AppConfig.java
    ├── JpaConfig.java
    ├── WebConfig.java
    └── SwaggerConfig.java
```

## Getting Started

### Prerequisites

- Java 17+
- Maven 3.9+
- MySQL 8.0+

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd fitness-tracker
   ```

2. **Create MySQL database**

   ```sql
   CREATE DATABASE fitness_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'fitness_user'@'localhost' IDENTIFIED BY 'fitness_password';
   GRANT ALL PRIVILEGES ON fitness_tracker.* TO 'fitness_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Run the schema**

   ```bash
   mysql -u fitness_user -p fitness_tracker < src/main/resources/schema.sql
   ```

4. **Configure application.properties**
   Update database credentials in `src/main/resources/application.properties`

5. **Build and run**

   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

6. **Access the API**
   - API Base URL: `http://localhost:8080/api`
   - Swagger UI: `http://localhost:8080/api/swagger-ui.html`

## Authentication

The API uses JWT (JSON Web Token) based authentication.

### Login Flow

1. Register a new account via `POST /api/auth/register`
2. Login via `POST /api/auth/login` to receive access and refresh tokens
3. Include the access token in subsequent requests:
   ```
   Authorization: Bearer <access_token>
   ```
4. When the access token expires, use the refresh token to get new tokens

### Token Types

| Token Type    | Purpose               | Expiration |
| ------------- | --------------------- | ---------- |
| Access Token  | API authentication    | 1 hour     |
| Refresh Token | Get new access tokens | 24 hours   |

## API Endpoints

### Authentication Endpoints

| Method | Endpoint                 | Description                 |
| ------ | ------------------------ | --------------------------- |
| POST   | /api/auth/register       | Register new user           |
| POST   | /api/auth/login          | User login                  |
| POST   | /api/auth/refresh        | Refresh tokens              |
| POST   | /api/auth/logout         | Logout user                 |
| GET    | /api/auth/check-username | Check username availability |
| GET    | /api/auth/check-email    | Check email availability    |

### User Endpoints

| Method | Endpoint            | Description              |
| ------ | ------------------- | ------------------------ |
| GET    | /api/users/me       | Get current user profile |
| PUT    | /api/users/me       | Update user profile      |
| DELETE | /api/users/me       | Delete user account      |
| GET    | /api/users/me/stats | Get user statistics      |

### Workout Endpoints

| Method | Endpoint             | Description                |
| ------ | -------------------- | -------------------------- |
| GET    | /api/workouts        | List workouts (paginated)  |
| GET    | /api/workouts/{id}   | Get specific workout       |
| POST   | /api/workouts        | Create new workout         |
| PUT    | /api/workouts/{id}   | Update workout             |
| DELETE | /api/workouts/{id}   | Delete workout             |
| GET    | /api/workouts/range  | Get workouts by date range |
| GET    | /api/workouts/recent | Get recent workouts        |

### Goal Endpoints

| Method | Endpoint                 | Description            |
| ------ | ------------------------ | ---------------------- |
| GET    | /api/goals               | List goals (paginated) |
| GET    | /api/goals/{id}          | Get specific goal      |
| POST   | /api/goals               | Create new goal        |
| PUT    | /api/goals/{id}          | Update goal            |
| DELETE | /api/goals/{id}          | Delete goal            |
| PUT    | /api/goals/{id}/progress | Update goal progress   |
| PATCH  | /api/goals/{id}/status   | Update goal status     |
| GET    | /api/goals/expiring      | Get expiring goals     |

## Request/Response Examples

### User Registration

**Request**

```http
POST /api/auth/register HTTP/1.1
Content-Type: application/json

{
  "username": "fitness_user",
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response** (201 Created)

```json
{
  "message": "User registered successfully",
  "userId": 1
}
```

### User Login

**Request**

```http
POST /api/auth/login HTTP/1.1
Content-Type: application/json

{
  "username": "fitness_user",
  "password": "SecurePass123!"
}
```

**Response** (200 OK)

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJmaXRuZXNzX3VzZXIiLCJpYXQiOjE3MDc4NTQzMjQsImV4cCI6MTcwNzg1NzkyNCwiaXNzIjoiZml0bmVzcy10cmFja2VyIn0.xyz...",
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "userId": 1,
  "username": "fitness_user",
  "email": "user@example.com"
}
```

### Create Workout

**Request**

```http
POST /api/workouts HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
Content-Type: application/json

{
  "workoutType": "RUNNING",
  "title": "Morning Run",
  "description": "Easy pace run in Central Park",
  "durationMinutes": 45,
  "caloriesBurned": 350,
  "distanceKm": 5.5,
  "workoutDate": "2024-02-15"
}
```

**Response** (201 Created)

```json
{
  "id": 1,
  "workoutType": "RUNNING",
  "workoutTypeName": "Running",
  "title": "Morning Run",
  "description": "Easy pace run in Central Park",
  "durationMinutes": 45,
  "caloriesBurned": 350,
  "distanceKm": 5.5,
  "workoutDate": "2024-02-15",
  "createdAt": "2024-02-15T08:30:00",
  "updatedAt": "2024-02-15T08:30:00"
}
```

### List Workouts

**Request**

```http
GET /api/workouts?page=0&size=10&sort=workoutDate,desc HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**Response** (200 OK)

```json
{
  "content": [
    {
      "id": 1,
      "workoutType": "RUNNING",
      "workoutTypeName": "Running",
      "title": "Morning Run",
      "durationMinutes": 45,
      "caloriesBurned": 350,
      "distanceKm": 5.5,
      "workoutDate": "2024-02-15"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 42,
  "totalPages": 5,
  "first": true,
  "last": false
}
```

### Create Goal

**Request**

```http
POST /api/goals HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
Content-Type: application/json

{
  "goalType": "WEIGHT_LOSS",
  "title": "Lose 5kg",
  "description": "Gradual weight reduction over 3 months",
  "targetValue": 5.0,
  "currentValue": 0.0,
  "unit": "kg",
  "startDate": "2024-01-01",
  "endDate": "2024-03-31"
}
```

**Response** (201 Created)

```json
{
  "id": 1,
  "goalType": "WEIGHT_LOSS",
  "goalTypeName": "Weight Loss",
  "title": "Lose 5kg",
  "description": "Gradual weight reduction over 3 months",
  "targetValue": 5.0,
  "currentValue": 0.0,
  "unit": "kg",
  "startDate": "2024-01-01",
  "endDate": "2024-03-31",
  "status": "ACTIVE",
  "progressPercentage": 0.0,
  "remainingDays": 90,
  "totalDays": 90,
  "elapsedDays": 0,
  "achieved": false,
  "expired": false,
  "createdAt": "2024-01-01T00:00:00"
}
```

### Update Goal Progress

**Request**

```http
PUT /api/goals/1/progress HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
Content-Type: application/json

{
  "currentValue": 3.5
}
```

**Response** (200 OK)

```json
{
  "id": 1,
  "goalType": "WEIGHT_LOSS",
  "title": "Lose 5kg",
  "targetValue": 5.0,
  "currentValue": 3.5,
  "status": "ACTIVE",
  "progressPercentage": 70.0,
  "remainingDays": 30,
  "achieved": false
}
```

### Get User Statistics

**Request**

```http
GET /api/users/me/stats HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**Response** (200 OK)

```json
{
  "totalWorkouts": 42,
  "totalCaloriesBurned": 25000,
  "totalDurationMinutes": 3600,
  "activeGoals": 3,
  "completedGoals": 12,
  "workoutsThisMonth": 8,
  "caloriesThisMonth": 4800
}
```

## Database Schema

### Entity Relationships

```
users (1) ----< (M) workouts
users (1) ----< (M) goals
users (1) ----< (M) refresh_tokens
users (M) >----< (M) roles
```

### Key Tables

```sql
-- Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    profile_picture_url VARCHAR(500),
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Workouts table
CREATE TABLE workouts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    workout_type VARCHAR(30) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INT NOT NULL,
    calories_burned INT NOT NULL,
    distance_km DECIMAL(10,2),
    workout_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Goals table
CREATE TABLE goals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    goal_type VARCHAR(30) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_value DECIMAL(15,4) NOT NULL,
    current_value DECIMAL(15,4) DEFAULT 0,
    unit VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Error Handling

All errors follow a consistent format:

```json
{
  "timestamp": "2024-02-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "errorCode": "VALIDATION_ERROR",
  "message": "Validation failed for one or more fields",
  "details": {
    "username": "Username must be between 3 and 50 characters",
    "email": "Invalid email format"
  },
  "path": "/api/auth/register"
}
```

### Error Codes

| Code        | HTTP Status | Description           |
| ----------- | ----------- | --------------------- |
| AUTH-001    | 401         | Invalid credentials   |
| AUTH-002    | 401         | Token expired         |
| AUTH-003    | 401         | Invalid token         |
| USER-001    | 404         | User not found        |
| USER-002    | 409         | Email already exists  |
| USER-003    | 409         | Username taken        |
| WORKOUT-001 | 404         | Workout not found     |
| WORKOUT-002 | 403         | Workout access denied |
| GOAL-001    | 404         | Goal not found        |
| GOAL-002    | 403         | Goal access denied    |
| VAL-001     | 400         | Validation error      |

## Testing

### Run Tests

```bash
mvn test
```

### Run with Coverage

```bash
mvn test jacoco:report
```

### Integration Tests

```bash
mvn verify -Pintegration-test
```

## Deployment

### Docker Build

```bash
docker build -t fitness-tracker:1.0.0 .
```

### Docker Run

```bash
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://host:3306/fitness_tracker \
  -e SPRING_DATASOURCE_USERNAME=fitness_user \
  -e SPRING_DATASOURCE_PASSWORD=secret \
  -e JWT_SECRET=your-secret-key \
  fitness-tracker:1.0.0
```

### Environment Variables

| Variable                   | Description           | Default |
| -------------------------- | --------------------- | ------- |
| SERVER_PORT                | Server port           | 8080    |
| SPRING_DATASOURCE_URL      | Database URL          | -       |
| SPRING_DATASOURCE_USERNAME | Database user         | -       |
| SPRING_DATASOURCE_PASSWORD | Database password     | -       |
| JWT_SECRET                 | JWT signing key       | -       |
| JWT_EXPIRATION             | Token expiration (ms) | 3600000 |

## License

Apache 2.0 License - see LICENSE file for details.
#   f i t n e s s - t r a c k e r - g o a l - m a n a g e m e n t - s y s t e m  
 