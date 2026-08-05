USE ram_stores;

INSERT INTO roles (name, description) VALUES
  ('admin', 'Super administrator'),
  ('staff', 'Sales and operations staff')
ON DUPLICATE KEY UPDATE description = VALUES(description);

INSERT INTO settings (key_name, value_text) VALUES
  ('company_name', 'RAM STORES'),
  ('company_address', 'Main Market, Hyderabad, Telangana'),
  ('company_phone', '+91 98765 43210'),
  ('company_email', 'care@ramstores.in'),
  ('company_website', 'https://ramstores.in'),
  ('company_gst_number', '29ABCDE1234F1Z5'),
  ('default_currency', 'INR'),
  ('invoice_prefix', 'RAM'),
  ('printer_width_mm', '58'),
  ('dark_mode', 'true')
ON DUPLICATE KEY UPDATE value_text = VALUES(value_text);

INSERT INTO categories (name, slug, description) VALUES
  ('Electronics', 'electronics', 'Electronic accessories and gadgets'),
  ('Home Essentials', 'home-essentials', 'Household and daily use products'),
  ('Fashion', 'fashion', 'Fashion and lifestyle products'),
  ('Grocery', 'grocery', 'Daily grocery items')
ON DUPLICATE KEY UPDATE description = VALUES(description);

INSERT INTO brands (name, description) VALUES
  ('Samsung', 'Samsung brand products'),
  ('Philips', 'Philips lighting and appliances'),
  ('Bajaj', 'Bajaj consumer products'),
  ('Local', 'Locally sourced products')
ON DUPLICATE KEY UPDATE description = VALUES(description);

INSERT INTO suppliers (company_name, contact_person, phone, email, gst_number, address) VALUES
  ('Apex Distributors', 'Ravi Kumar', '9876543210', 'ravi@apexdist.in', '36ABCD1234F1Z5', 'Banjara Hills, Hyderabad'),
  ('Metro Supply Co.', 'Anita Shah', '9988776655', 'sales@metrosupply.in', '29XYZW9876F1Z9', 'Madhapur, Hyderabad')
ON DUPLICATE KEY UPDATE phone = VALUES(phone);

INSERT INTO customers (customer_name, phone, email, gst_number, address) VALUES
  ('Walk-in Customer', '0000000000', 'walkin@ramstores.in', NULL, 'Retail store walk-in customer'),
  ('Ramesh Kumar', '9000000001', 'ramesh@example.com', '29AAAA1111A1Z1', 'Gachibowli, Hyderabad'),
  ('Priya Nair', '9000000002', 'priya@example.com', '36BBBB2222B2Z2', 'Miyapur, Hyderabad')
ON DUPLICATE KEY UPDATE email = VALUES(email);

INSERT INTO products (barcode, sku, name, category_id, brand_id, supplier_id, mrp, selling_price, purchase_price, gst_rate, hsn_code, minimum_stock, status) VALUES
  ('8901234567890', 'ELE-001', 'Samsung USB Cable', 1, 1, 1, 399.00, 299.00, 220.00, 18.00, '8544', 20, 'active'),
  ('8901234567891', 'HOME-002', 'Philips Bulb 9W', 2, 2, 2, 260.00, 199.00, 140.00, 12.00, '8539', 15, 'active'),
  ('8901234567892', 'FASH-003', 'Premium Cotton T-Shirt', 3, 4, 2, 899.00, 699.00, 470.00, 5.00, '6109', 25, 'active')
ON DUPLICATE KEY UPDATE selling_price = VALUES(selling_price);

INSERT INTO inventory (product_id, current_stock, reserved_stock, purchase_price, selling_price) VALUES
  ((SELECT id FROM products WHERE sku = 'ELE-001'), 90, 5, 220.00, 299.00),
  ((SELECT id FROM products WHERE sku = 'HOME-002'), 80, 2, 140.00, 199.00),
  ((SELECT id FROM products WHERE sku = 'FASH-003'), 60, 3, 470.00, 699.00)
ON DUPLICATE KEY UPDATE current_stock = VALUES(current_stock);

INSERT INTO users (role_id, full_name, email, phone, password_hash) VALUES
  ((SELECT id FROM roles WHERE name = 'admin'), 'System Administrator', 'admin@ramstores.in', '9999999999', '$2a$10$aY2mEibJ/mIxNFTkBQMIn.vE9mi3i4Ysq4b8iC2wuKsGK/F7VsGSa'),
  ((SELECT id FROM roles WHERE name = 'staff'), 'Staff User', 'staff@ramstores.in', '9888888888', '$2a$10$xZn40fXURJZ.jWusY5dQluF3grHnVJ88ylPfzj8lLohhbwFuAHqJa')
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- Passwords:
-- admin@ramstores.in -> Admin@123
-- staff@ramstores.in -> Staff@123
