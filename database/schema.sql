-- create database
CREATE DATABASE IF NOT EXISTS shop;
USE shop;

-- customers table
CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE
);

-- products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price INT NOT NULL,
  stock INT NOT NULL DEFAULT 0
);

-- orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  total_price INT NOT NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- view: purchase history (join orders + customers + products)
CREATE OR REPLACE VIEW purchase_history AS
SELECT
  o.id AS order_id,
  c.name AS customer,
  p.name AS product,
  o.quantity,
  o.total_price,
  o.order_date
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN products p ON o.product_id = p.id;

-- trigger: reduce stock after every order
DELIMITER $$
CREATE TRIGGER reduce_stock
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
  UPDATE products
  SET stock = stock - NEW.quantity
  WHERE id = NEW.product_id;
END$$
DELIMITER ;

-- sample products 
INSERT INTO products (name, price, stock) VALUES
  ('Wireless Headphones', 1209 ,50),
  ('Mechanical Keyboard', 2499, 30),
  ('USB-C Hub', 899, 75),
  ('Webcam HD', 1599, 40),
  ('Mouse Pad XL', 399, 100),
  ('LED Desk Lamp', 699, 60),
  ('Gaming Monitor 4K', 29999, 15),
  ('Bluetooth Speaker', 1299, 85),
  ('Wireless Mouse', 899, 120),
  ('Laptop Cooling Pad', 1499, 45),
  ('Ergonomic Desk Chair', 7500, 20),
  ('Smartphone Stand', 299, 200),
  ('Noise Cancelling Earbuds', 4999, 40),
  ('1TB Portable SSD', 8999, 35),
  ('Power Strip Surge Protector', 599, 150),
  ('Adjustable Standing Desk', 15999, 10);
