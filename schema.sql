CREATE DATABASE ecommerce;

USE ecommerce;

CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    name VARCHAR(50),
    city VARCHAR(50)
);

CREATE TABLE products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(50),
    category VARCHAR(50),
    cost_price INT,
    selling_price INT
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    product_id INT,
    quantity INT,
    price INT,
    order_date DATE
);

CREATE VIEW sales_data AS
SELECT
    o.order_id,
    o.order_date,
    c.name,
    c.city,
    p.product_name,
    p.category,
    o.quantity,
    o.price,
    (o.quantity * o.price) AS revenue,
    (o.quantity * (o.price - p.cost_price)) AS profit
FROM orders o
JOIN customers c
ON o.customer_id = c.customer_id
JOIN products p
ON o.product_id = p.product_id;