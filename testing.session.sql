-- @block 
-- Creating users table
CREATE TABLE IF NOT EXISTS users(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(100) NOT NULL,
    status VARCHAR(45)
);


-- @block
-- Inserting data into users table
INSERT INTO users (name, email, password, status)
VALUES  
    ('Tanaka', 'tanaka@gmail.com', 'mona_1', 'Member'),
    ('Casper', 'casper@gmail.com', 'masters_2', 'Member'),
    ('Kgethego', 'kg@gmail.com', 'afri_3', 'Visitor'),
    ('Shingai', 'shingai@gmail.com', 'nothing_4', 'Member');


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

-- @block
-- Remove user recordss
DELETE FROM users;;