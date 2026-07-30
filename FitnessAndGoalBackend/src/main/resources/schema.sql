-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS workouts;
DROP TABLE IF EXISTS goals;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Roles table
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- User-Roles junction table
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Workouts table
CREATE TABLE workouts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    workout_type VARCHAR(100),
    muscle VARCHAR(100),
    exercise_name VARCHAR(255),
    equipment VARCHAR(255),
    difficulty VARCHAR(50),
    sets INT,
    reps INT,
    weight DOUBLE,
    distance DOUBLE,
    duration INT NULL,
    calories DOUBLE NULL,
    notes TEXT,
    workout_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Goals table
CREATE TABLE goals (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    goal_type ENUM(
        'WEIGHT_LOSS',
        'WEIGHT_GAIN',
        'MUSCLE_GAIN',
        'FLEXIBILITY',
        'CARDIO',
        'STRENGTH',
        'BODY_FAT_REDUCTION',
        'CUSTOM'
    ) NOT NULL,
    target VARCHAR(50),
    progress VARCHAR(50),
    target_value DOUBLE DEFAULT NULL,
    current_value DOUBLE DEFAULT 0.0,
    status ENUM(
        'NOT_STARTED',
        'IN_PROGRESS',
        'COMPLETED'
    ) DEFAULT 'NOT_STARTED',
    start_date DATE,
    target_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert initial roles
INSERT INTO roles (name) VALUES ('ROLE_USER'), ('ROLE_ADMIN');

-- Indexes for performance
CREATE INDEX idx_workouts_user_id ON workouts(user_id);
CREATE INDEX idx_workouts_workout_type ON workouts(workout_type);
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_goal_type ON goals(goal_type);
CREATE INDEX idx_goals_status ON goals(status);
CREATE INDEX idx_goals_target_date ON goals(target_date);
CREATE INDEX idx_goals_start_date ON goals(start_date);
CREATE INDEX idx_user_email ON users(email);
