/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} [full_name]
 * @property {string} [avatar_url]
 * @property {'beginner'|'intermediate'|'advanced'} fitness_level
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Profile
 * @property {string} id
 * @property {string} [full_name]
 * @property {string} [avatar_url]
 * @property {'beginner'|'intermediate'|'advanced'} fitness_level
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {'running'|'cycling'|'swimming'|'weightlifting'|'yoga'|'hiit'|'walking'|'cardio'|'strength'|'other'} WorkoutType
 */

/**
 * @typedef {'low'|'moderate'|'high'|'very_high'} IntensityLevel
 */

/**
 * @typedef {Object} Workout
 * @property {string} id
 * @property {string} user_id
 * @property {WorkoutType} workout_type
 * @property {string} title
 * @property {string} [description]
 * @property {number} duration_minutes
 * @property {number} [calories_burned]
 * @property {IntensityLevel} intensity
 * @property {string} workout_date
 * @property {string} [notes]
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} WorkoutInput
 * @property {WorkoutType} workout_type
 * @property {string} title
 * @property {string} [description]
 * @property {number} duration_minutes
 * @property {number} [calories_burned]
 * @property {IntensityLevel} intensity
 * @property {string} workout_date
 * @property {string} [notes]
 */

/**
 * @typedef {'weight_loss'|'muscle_gain'|'endurance'|'strength'|'flexibility'|'cardio'|'custom'} GoalType
 */

/**
 * @typedef {'not_started'|'in_progress'|'completed'|'abandoned'} GoalStatus
 */

/**
 * @typedef {'low'|'medium'|'high'} Priority
 */

/**
 * @typedef {Object} Goal
 * @property {string} id
 * @property {string} user_id
 * @property {string} title
 * @property {string} [description]
 * @property {GoalType} goal_type
 * @property {number} target_value
 * @property {number} current_value
 * @property {string} unit
 * @property {string} start_date
 * @property {string} [target_date]
 * @property {GoalStatus} status
 * @property {Priority} priority
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} GoalInput
 * @property {string} title
 * @property {string} [description]
 * @property {GoalType} goal_type
 * @property {number} target_value
 * @property {number} [current_value]
 * @property {string} unit
 * @property {string} [start_date]
 * @property {string} [target_date]
 * @property {GoalStatus} [status]
 * @property {Priority} [priority]
 */

/**
 * @typedef {Object} AuthState
 * @property {User|null} user
 * @property {Profile|null} profile
 * @property {boolean} loading
 * @property {string|null} error
 */

/**
 * @typedef {Object} DashboardStats
 * @property {number} totalWorkouts
 * @property {number} totalCalories
 * @property {number} totalMinutes
 * @property {number} activeGoals
 * @property {number} completedGoals
 * @property {string} mostFrequentWorkout
 * @property {number} weeklyWorkouts
 */