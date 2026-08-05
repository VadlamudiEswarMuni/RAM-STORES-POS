import { query } from '../config/db.js';

export const getDashboard = async (req, res, next) => {
  try {
    const [summary] = await query(`
      SELECT
        (SELECT COALESCE(SUM(grand_total), 0) FROM invoices WHERE invoice_date >= CURDATE()) AS today_sales,
        (SELECT COALESCE(SUM(grand_total), 0) FROM invoices WHERE invoice_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)) AS weekly_sales,
        (SELECT COALESCE(SUM(grand_total), 0) FROM invoices WHERE invoice_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) AS monthly_sales,
        (SELECT COUNT(*) FROM customers) AS total_customers,
        (SELECT COUNT(*) FROM products) AS total_products,
        (SELECT COUNT(*) FROM invoices) AS total_invoices,
        (SELECT COALESCE(SUM(current_stock), 0) FROM inventory) AS total_stock_units
    `);

    const topProducts = await query(`
      SELECT p.name, SUM(ii.quantity) AS units_sold
      FROM invoice_items ii
      JOIN products p ON p.id = ii.product_id
      GROUP BY ii.product_id, p.name
      ORDER BY units_sold DESC
      LIMIT 5
    `);

    const salesByDay = await query(`
      SELECT DATE(invoice_date) AS label, COALESCE(SUM(grand_total), 0) AS total
      FROM invoices
      WHERE invoice_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY DATE(invoice_date)
      ORDER BY DATE(invoice_date) ASC
    `);

    return res.status(200).json({
      summary,
      topProducts,
      salesByDay,
    });
  } catch (error) {
    next(error);
  }
};
