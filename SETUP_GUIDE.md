# ShopEasy — Complete Setup & Testing Guide

> **Stack:** HTML · CSS · JavaScript · Node.js · Express · MySQL  
> **Time needed:** ~10 minutes

---

## WHAT YOU WILL HAVE AFTER THIS GUIDE

```
✅ MySQL database created with tables, view, trigger, and sample data
✅ Backend server running at http://localhost:3000
✅ Frontend working in the browser
✅ Full shopping flow tested and verified
```

---

## PART 1 — MYSQL WORKBENCH SETUP

### Step 1 — Open MySQL Workbench

1. Launch **MySQL Workbench** from your Start menu.
2. On the home screen you will see a connection card (usually called **"Local instance MySQL80"** or similar).
3. Click the card to open it.
4. If it asks for a password, enter your MySQL root password (or leave blank if you never set one).

**Expected result:**  
A query editor opens with a green connection indicator at the bottom.

---

### Step 2 — Run the Schema File

1. In the top menu click **File → Open SQL Script...**
2. Navigate to:
   ```
   C:\Users\onew2\Desktop\dbms project\database\schema.sql
   ```
3. Click **Open** — the file content will appear in the editor.
4. Press the **lightning bolt ⚡** button (or press `Ctrl + Shift + Enter`) to run **all statements**.

**Expected result — you should see in the Output panel:**

```
✅  CREATE DATABASE shop       — Action Output: OK
✅  USE shop                   — Action Output: OK
✅  CREATE TABLE customers      — Action Output: OK
✅  CREATE TABLE products       — Action Output: OK
✅  CREATE TABLE orders         — Action Output: OK
✅  CREATE VIEW purchase_history — Action Output: OK
✅  CREATE TRIGGER reduce_stock — Action Output: OK
✅  INSERT (6 products)         — 6 row(s) affected
```

> If you see any red ❌ errors, see the **Troubleshooting** section at the bottom.

---

### Step 3 — Verify the Database

Run these queries **one by one** in a new query tab to confirm everything is set up:

#### Check tables exist
```sql
USE shop;
SHOW TABLES;
```
**Expected result:**
```
+--------------------+
| Tables_in_shop     |
+--------------------+
| customers          |
| orders             |
| products            |
+--------------------+
3 rows in set
```

#### Check products have sample data
```sql
SELECT * FROM products;
```
**Expected result:**

| id | name                 | price | stock |
|----|----------------------|-------|-------|
| 1  | Wireless Headphones  | 1299  | 50    |
| 2  | Mechanical Keyboard  | 2499  | 30    |
| 3  | USB-C Hub            | 899   | 75    |
| 4  | Webcam HD            | 1599  | 40    |
| 5  | Mouse Pad XL         | 399   | 100   |
| 6  | LED Desk Lamp        | 699   | 60    |

#### Check the VIEW exists
```sql
SHOW FULL TABLES WHERE Table_type = 'VIEW';
```
**Expected result:**
```
+-----------------------------+
| Tables_in_shop              |
+-----------------------------+
| purchase_history            |
+-----------------------------+
```

#### Check the TRIGGER exists
```sql
SHOW TRIGGERS;
```
**Expected result:**  
You should see one row with `Trigger = reduce_stock`, `Event = INSERT`, `Table = orders`.

---

## PART 2 — CONFIGURE THE .ENV FILE

Open this file in a text editor:
```
C:\Users\onew2\Desktop\dbms project\backend\.env
```

It looks like this:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=shop
PORT=3000
```

**If your MySQL root user has a password**, change `DB_PASSWORD=` to:
```
DB_PASSWORD=YourPasswordHere
```

Save the file.

---

## PART 3 — START THE BACKEND SERVER

### Step 4 — Open a Terminal (Command Prompt or PowerShell)

Press `Win + R`, type `cmd`, press Enter.

### Step 5 — Navigate to the backend folder

```cmd
cd "C:\Users\onew2\Desktop\dbms project\backend"
```

### Step 6 — Start the server

```cmd
node server.js
```

**Expected result — you should see:**
```
connected to mysql database: shop
server running on http://localhost:3000
```

> **Keep this terminal window open.** Closing it will stop the server.

---

## PART 4 — OPEN THE WEBSITE

### Step 7 — Open the Home Page

1. Open your web browser (Chrome, Edge, etc.).
2. Go to this URL: **[http://localhost:3000](http://localhost:3000)**

**Expected result:**  
- A clean white & green home page loads.
- The stats bar shows featured products (live from DB).

---

## PART 5 — TEST THE FULL FLOW

### Test 1 — Register a new customer

1. Click **"Get Started"** or go to `login.html`.
2. Click the **Register** tab.
3. Enter:
   - Name: `John Doe`
   - Email: `john@test.com`
4. Click **"Create Account"**.

**Expected result:**  
Toast message: `account created — please login`

**Verify in MySQL Workbench:**
```sql
SELECT * FROM customers;
```
```
| id | name     | email         |
|----|----------|---------------|
| 1  | John Doe | john@test.com |
```

---

### Test 2 — Login

1. Switch to the **Login** tab.
2. Enter: `john@test.com`
3. Click **Login**.

**Expected result:**  
Redirects to `products.html`. Navbar shows `John Doe` badge.

---

### Test 3 — Add to Cart and Place Order

1. On the Products page, click **"Add to Cart"** on `Wireless Headphones`.
2. Go to **Cart** page.
3. Make sure qty is = `1`.
4. Click **"Place Order"**.

**Expected result:**  
- Toast: `order placed successfully!`
- Automatically redirects to History page.
- History shows the order in the table.

**Verify in MySQL Workbench:**

```sql
-- check order was created
SELECT * FROM orders;
```
```
| id | customer_id | product_id | quantity | total_price | order_date          |
|----|-------------|------------|----------|-------------|---------------------|
| 1  | 1           | 1          | 1        | 1299        | 2026-03-18 xx:xx:xx |
```

```sql
-- check TRIGGER reduced stock automatically
SELECT id, name, stock FROM products WHERE id = 1;
```
```
-- stock was 50, should now be 49
| id | name                | stock |
|----|---------------------|-------|
| 1  | Wireless Headphones | 49    |
```

```sql
-- check VIEW works
SELECT * FROM purchase_history;
```
```
| order_id | customer | product             | quantity | total_price | order_date |
|----------|----------|---------------------|----------|-------------|------------|
| 1        | John Doe | Wireless Headphones | 1        | 1299        | ...        |
```

---

### Test 4 — History Page (VIEW)

Go to `history.html`. It should display:

| # | Product              | Qty | Total  | Date         |
|---|----------------------|-----|--------|--------------|
| 1 | Wireless Headphones  | 1   | ₹1,299 | 18 Mar 2026  |

This data comes from the **`purchase_history` VIEW** (a JOIN of orders + customers + products).

---

## PART 6 — TEST THE API DIRECTLY (OPTIONAL)

Open a browser and go to these URLs to test backend APIs directly:

| URL | What you should see |
|-----|---------------------|
| `http://localhost:3000/products` | JSON list of all 6 products |
| `http://localhost:3000/orders/details` | JSON with customer name + product + total |
| `http://localhost:3000/orders/history` | JSON from the purchase_history VIEW |

---

## PART 7 — PAGE SUMMARY

| Page | File | What it does |
|------|------|--------------|
| Home | `index.html` | Landing page, live stats |
| Login/Register | `login.html` | Auth with tabbed form |
| Products | `products.html` | Grid of all products, add to cart |
| Cart | `cart.html` | Manage cart, place order |
| History | `history.html` | Past orders from DB VIEW |

---

## TROUBLESHOOTING

### "Cannot connect to server" in browser
→ Make sure `node server.js` is running in the terminal.  
→ Check that port 3000 is not blocked.

### "database connection failed" in terminal
→ Open `.env` and check `DB_PASSWORD` is correct.  
→ Make sure MySQL service is running:  
   `Win + R` → `services.msc` → find **MySQL80** → click **Start**

### Schema already exists error in Workbench
```sql
-- Run this to reset completely
DROP DATABASE IF EXISTS shop;
```
Then run the schema.sql file again.

### "email already registered" on register
→ That email is already in the `customers` table.  
→ Use a different email, or clear the table:
```sql
USE shop; DELETE FROM customers;
```

---

## QUICK REFERENCE — ALL COMMANDS

```cmd
rem 1. navigate to backend folder
cd "C:\Users\onew2\Desktop\dbms project\backend"

rem 2. start the server
node server.js

rem 3. open home page
start http://localhost:3000
```

---

*Guide generated for ShopEasy DBMS Project — March 2026*
