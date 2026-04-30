-- E-Commerce Database Schema
-- Run this file in MySQL to set up the database

CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

CREATE TABLE IF NOT EXISTS orders (
    order_id   INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    product_id  INT,
    quantity    INT,
    price       INT,
    order_date  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Optional: seed some sample data for testing
-- INSERT INTO orders (customer_id, product_id, quantity, price) VALUES
-- (1, 1, 1, 75000),
-- (2, 2, 2, 499),
-- (3, 3, 1, 25000);