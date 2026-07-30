-- =============================================================================
-- Initial Data for Testing
-- =============================================================================

-- Insert roles
INSERT INTO roles (name)
SELECT * FROM (SELECT 'ROLE_USER') AS tmp
WHERE NOT EXISTS (SELECT name FROM roles WHERE name = 'ROLE_USER')
LIMIT 1;

INSERT INTO roles (name)
SELECT * FROM (SELECT 'ROLE_ADMIN') AS tmp
WHERE NOT EXISTS (SELECT name FROM roles WHERE name = 'ROLE_ADMIN')
LIMIT 1;

-- Insert test admin user (password: Admin@123 - BCrypt encoded)
-- Note: In production, use proper BCrypt encoding
INSERT INTO users (username, email, password, first_name, last_name, enabled)
SELECT 'admin', 'admin@fitness.com', '$2a$10$N.zmdr9k7uOCXbLY6vFPKu9y3l8kJMC.E.K/Gf6YxWYmWQZ5d7KHa',
       'Admin', 'User', TRUE
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

-- Assign admin role
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'ROLE_ADMIN'
ON DUPLICATE KEY UPDATE user_id = user_id;
