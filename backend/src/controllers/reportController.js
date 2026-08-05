import { query } from '../config/db.js';

export const getReports = async (req, res, next) => {
  try {
    const { type = 'daily' } = req.query;

    let queryText = '';

    switch (type) {
      case 'daily':
        queryText = `
          SELECT DATE(invoice_date) AS period, SUM(grand_total) AS total_sales, COUNT(*) AS total_invoices
          FROM invoices
          WHERE invoice_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
          GROUP BY DATE(invoice_date)
          ORDER BY DATE(invoice_date) DESC
        `;
        break;
      case 'monthly':
        queryText = `
          SELECT DATE_FORMAT(invoice_date, '%Y-%m') AS period, SUM(grand_total) AS total_sales, COUNT(*) AS total_invoices
          FROM invoices
          WHERE invoice_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
          GROUP BY DATE_FORMAT(invoice_date, '%Y-%m')
          ORDER BY period DESC
        `;
        break;
      case 'product':
        queryText = `
          SELECT p.name, SUM(ii.quantity) AS quantity_sold, SUM(ii.amount) AS revenue
          FROM invoice_items ii
          JOIN products p ON p.id = ii.product_id
          GROUP BY p.id, p.name
          ORDER BY revenue DESC
          LIMIT 10
        `;
        break;
      case 'inventory':
        queryText = `
          SELECT p.name, i.current_stock, p.minimum_stock, p.selling_price
          FROM inventory i
          JOIN products p ON p.id = i.product_id
          ORDER BY i.current_stock ASC
        `;
        break;
      default:
        queryText = `
          SELECT DATE(invoice_date) AS period, SUM(grand_total) AS total_sales
          FROM invoices
          GROUP BY DATE(invoice_date)
          ORDER BY DATE(invoice_date) DESC
          LIMIT 10
        `;
    }

    const rows = await query(queryText);
    return res.status(200).json({ type, data: rows });
  } catch (error) {
    next(error);
  }
};
