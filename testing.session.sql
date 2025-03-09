-- @block 
-- Creating users table
CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    status VARCHAR(45)
);

-- @block
-- Create refresh_token table
CREATE TABLE IF NOT EXISTS refresh_tokens(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    token TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- @block
-- Create visitors table
CREATE TABLE IF NOT EXISTS visitors(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    message TEXT NOT NULL
);


-- @block
-- Inserting data into users table
INSERT INTO users (name, email, password, phone_number, status)
VALUES  
    ('Tanaka', 'tanaka@gmail.com', 'mona_1', '012345', 'Member'),
    ('Casper', 'casper@gmail.com', 'masters_2', '0234567', 'Member'),
    ('Kgethego', 'kg@gmail.com', 'afri_3', '076543', 'Visitor'),
    ('Shingai', 'shingai@gmail.com', 'nothing_4', '098765', 'Member');


-- @block
-- Get all users
SELECT * FROM users;


-- @block
-- Get all visitors
SELECT * FROM users
WHERE status = 'Visitor';


-- @block
-- Get all members
SELECT * FROM users
WHERE status = 'Member';


-- @block
-- Creating Database Indexes
CREATE INDEX status_index ON users(status);
CREATE INDEX email_index ON users(email);
CREATE INDEX email_index ON visitors(email);

-- @block
-- Remove user records
DELETE FROM users;