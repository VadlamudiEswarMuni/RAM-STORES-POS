import { query, execute } from '../config/db.js';

export const listProducts = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const rows = await query(`
      SELECT p.*, c.name AS category_name, b.name AS brand_name, i.current_stock, i.purchase_price, i.selling_price
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN brands b ON b.id = p.brand_id
      LEFT JOIN inventory i ON i.product_id = p.id
      WHERE p.name LIKE ? OR p.barcode LIKE ? OR p.sku LIKE ?
      ORDER BY p.created_at DESC
    `, [`%${search}%`, `%${search}%`, `%${search}%`]);

    return res.status(200).json({ products: rows });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const {
      barcode,
      sku,
      name,
      category_id,
      brand_id,
      supplier_id,
      mrp,
      selling_price,
      purchase_price,
      gst_rate,
      hsn_code,
      minimum_stock,
      image_url,
      status,
    } = req.body;

    if (!name || !selling_price) {
      return res.status(400).json({ message: 'Product name and selling price are required.' });
    }

    const result = await execute(
      `INSERT INTO products (barcode, sku, name, category_id, brand_id, supplier_id, mrp, selling_price, purchase_price, gst_rate, hsn_code, minimum_stock, image_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        barcode || null,
        sku || null,
        name,
        category_id || null,
        brand_id || null,
        supplier_id || null,
        mrp || 0,
        selling_price,
        purchase_price || 0,
        gst_rate || 0,
        hsn_code || null,
        minimum_stock || 0,
        image_url || null,
        status || 'active',
      ]
    );

    const productId = result.insertId;
    await execute(
      `INSERT INTO inventory (product_id, current_stock, reserved_stock, purchase_price, selling_price)
       VALUES (?, 0, 0, ?, ?)`,
      [productId, purchase_price || 0, selling_price]
    );

    return res.status(201).json({ message: 'Product created successfully.', productId });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = req.body;

    const entries = Object.entries(fields).filter(([_, value]) => value !== undefined);
    if (!entries.length) {
      return res.status(400).json({ message: 'No fields to update.' });
    }

    const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([_, value]) => value);
    values.push(id);

    await execute(`UPDATE products SET ${setClause} WHERE id = ?`, values);

    return res.status(200).json({ message: 'Product updated successfully.' });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await execute(`DELETE FROM products WHERE id = ?`, [id]);
    return res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
