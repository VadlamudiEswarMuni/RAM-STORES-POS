import { query, execute } from '../config/db.js';

export const listCustomers = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const rows = await query(
      `SELECT * FROM customers WHERE customer_name LIKE ? OR phone LIKE ? OR email LIKE ? ORDER BY created_at DESC`,
      [`%${search}%`, `%${search}%`, `%${search}%`]
    );
    return res.status(200).json({ customers: rows });
  } catch (error) {
    next(error);
  }
};

export const createCustomer = async (req, res, next) => {
  try {
    const { customer_name, phone, email, gst_number, address } = req.body;

    if (!customer_name || !phone) {
      return res.status(400).json({ message: 'Customer name and phone are required.' });
    }

    const result = await execute(
      `INSERT INTO customers (customer_name, phone, email, gst_number, address) VALUES (?, ?, ?, ?, ?)`,
      [customer_name, phone, email || null, gst_number || null, address || null]
    );

    return res.status(201).json({ message: 'Customer created successfully.', customerId: result.insertId });
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const entries = Object.entries(payload).filter(([_, value]) => value !== undefined);
    const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([_, value]) => value);
    values.push(id);

    await execute(`UPDATE customers SET ${setClause} WHERE id = ?`, values);
    return res.status(200).json({ message: 'Customer updated successfully.' });
  } catch (error) {
    next(error);
  }
};
