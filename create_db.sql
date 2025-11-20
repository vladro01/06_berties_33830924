# Create database script for Berties books

# Create the database
CREATE DATABASE IF NOT EXISTS berties_books;
USE berties_books;

# Create the tables
CREATE TABLE IF NOT EXISTS books (
    id     INT AUTO_INCREMENT,
    name   VARCHAR(50),
    price  DECIMAL(5, 2),
    PRIMARY KEY(id));

# Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    first VARCHAR(50) NOT NULL,
    last VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    hashedPassword VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
);

# Login audit table
CREATE TABLE IF NOT EXISTS login_audit (
    id INT AUTO_INCREMENT,
    username VARCHAR(50),
    success BOOLEAN NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);