# Database Schema Specification
## Urban Air AI

The database architecture is designed with strict relational integrity, UUIDs, UTC timestamps, and indexed query patterns.

---

## 1. Tables Overview

### 1.1 `users`
- `id`: VARCHAR(36) / UUID, Primary Key
- `email`: VARCHAR(255), Unique, Indexed
- `hashed_password`: VARCHAR(255), Not Null
- `full_name`: VARCHAR(255), Not Null
- `country`: VARCHAR(64), Default "India"
- `preferred_language`: VARCHAR(16), Default "en" (en, hi, gu)
- `created_at`: TIMESTAMP WITH TIME ZONE (UTC)
- `updated_at`: TIMESTAMP WITH TIME ZONE (UTC)

### 1.2 `user_preferences`
- `id`: VARCHAR(36), Primary Key
- `user_id`: VARCHAR(36), Foreign Key (`users.id`, ON DELETE CASCADE), Unique
- `occupation`: VARCHAR(64)
- `wake_time`: VARCHAR(8) (e.g., "06:30")
- `sleep_time`: VARCHAR(8) (e.g., "22:30")
- `working_hours`: VARCHAR(32) (e.g., "09:00-18:00")
- `commute_mode`: VARCHAR(32) (e.g., "metro", "bus", "car", "bicycle", "walk")
- `exercise_type`: VARCHAR(32) (e.g., "running", "walking", "cycling", "gym")
- `environmental_goals`: JSON / TEXT
- `onboarding_completed`: BOOLEAN, Default FALSE

### 1.3 `locations`
- `id`: VARCHAR(36), Primary Key
- `city_name`: VARCHAR(128), Not Null, Indexed
- `state_name`: VARCHAR(128)
- `latitude`: FLOAT, Not Null
- `longitude`: FLOAT, Not Null
- `monitoring_station_name`: VARCHAR(255)
- `station_source`: VARCHAR(64) (e.g., "CPCB", "OpenAQ", "Open-Meteo")

### 1.4 `user_locations`
- `id`: VARCHAR(36), Primary Key
- `user_id`: VARCHAR(36), Foreign Key (`users.id`, ON DELETE CASCADE)
- `location_id`: VARCHAR(36), Foreign Key (`locations.id`, ON DELETE CASCADE)
- `is_primary`: BOOLEAN, Default TRUE
- `created_at`: TIMESTAMP WITH TIME ZONE (UTC)

### 1.5 `family_members`
- `id`: VARCHAR(36), Primary Key
- `user_id`: VARCHAR(36), Foreign Key (`users.id`, ON DELETE CASCADE), Indexed
- `name`: VARCHAR(128), Not Null
- `age_group`: VARCHAR(32), Not Null (e.g., "child", "adult", "senior", "pregnant")
- `sensitivity_notes`: VARCHAR(255)
- `activity_preferences`: JSON / TEXT
- `created_at`: TIMESTAMP WITH TIME ZONE (UTC)

### 1.6 `daily_plans`
- `id`: VARCHAR(36), Primary Key
- `user_id`: VARCHAR(36), Foreign Key (`users.id`, ON DELETE CASCADE), Indexed
- `plan_date`: DATE, Not Null, Indexed
- `aqi_value`: INTEGER, Not Null
- `aqi_category`: VARCHAR(32), Not Null
- `weather_summary`: VARCHAR(255)
- `summary`: TEXT
- `data_status`: VARCHAR(32) (e.g., "fresh", "delayed", "fallback")
- `created_at`: TIMESTAMP WITH TIME ZONE (UTC)

### 1.7 `plan_activities`
- `id`: VARCHAR(36), Primary Key
- `plan_id`: VARCHAR(36), Foreign Key (`daily_plans.id`, ON DELETE CASCADE), Indexed
- `time_bracket`: VARCHAR(32), Not Null (e.g., "morning", "afternoon", "evening", "night")
- `suggested_time`: VARCHAR(16), Not Null
- `category`: VARCHAR(64), Not Null
- `title`: VARCHAR(255), Not Null
- `action`: TEXT, Not Null
- `reason`: TEXT, Not Null
- `alternative`: TEXT, Not Null
- `evidence_type`: VARCHAR(64), Not Null
- `status`: VARCHAR(32), Default "pending" (pending, completed, skipped)
- `created_at`: TIMESTAMP WITH TIME ZONE (UTC)

### 1.8 `impact_records`
- `id`: VARCHAR(36), Primary Key
- `user_id`: VARCHAR(36), Foreign Key (`users.id`, ON DELETE CASCADE), Indexed
- `date`: DATE, Not Null
- `baseline_mode`: VARCHAR(32), Not Null
- `chosen_mode`: VARCHAR(32), Not Null
- `distance_km`: FLOAT, Not Null
- `co2e_saved_kg`: FLOAT, Not Null
- `assumptions`: TEXT
- `created_at`: TIMESTAMP WITH TIME ZONE (UTC)

### 1.9 `notifications`
- `id`: VARCHAR(36), Primary Key
- `user_id`: VARCHAR(36), Foreign Key (`users.id`, ON DELETE CASCADE), Indexed
- `type`: VARCHAR(64), Not Null
- `title`: VARCHAR(255), Not Null
- `message`: TEXT, Not Null
- `is_read`: BOOLEAN, Default FALSE
- `created_at`: TIMESTAMP WITH TIME ZONE (UTC)
