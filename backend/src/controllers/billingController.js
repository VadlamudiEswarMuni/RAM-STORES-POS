import { query, execute } from '../config/db.js';

const generateInvoiceNumber = async () => {
  const today = new Date();
  const datePart = today.toISOString().slice(0, 10).replace(/-/g, '');
  const [row] = await query(`SELECT COUNT(*) AS count FROM invoices WHERE DATE(invoice_date) = CURDATE()`);
  const sequence = Number(row.count) + 1;
  return `RAM-${datePart}-${String(sequence).padStart(6, '0')}`;
};

export const createInvoice = async (req, res, next) => {
  try {
    const {
      invoiceType = 'offline',
      customerName,
      phone,
      address,
      items,
      paymentMethod,
      couponCode,
      salesPerson,
      notes,
      orderId,
      marketplace,
      paymentStatus,
      customerId,
    } = req.body;

    const normalizedType = invoiceType === 'online' ? 'online' : 'offline';

    if (normalizedType === 'online' && !orderId) {
      return res.status(400).json({ message: 'Order ID is mandatory for online invoices.' });
    }

    if (normalizedType === 'online' && orderId) {
      const existing = await query(`SELECT id FROM invoices WHERE order_id = ?`, [orderId]);
      if (existing.length) {
        return res.status(400).json({ message: 'Order ID must be unique. Duplicate order ID is not allowed.' });
      }
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'At least one product is required.' });
    }

    let customerIdValue = customerId || null;
    if (!customerIdValue && (customerName || phone)) {
      const customerResult = await execute(
        `INSERT INTO customers (customer_name, phone, address) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE customer_name = VALUES(customer_name), address = VALUES(address)`,
        [customerName || 'Walk-in Customer', phone || '0000000000', address || null]
      );
      customerIdValue = customerResult.insertId || (await query(`SELECT id FROM customers WHERE phone = ?`, [phone || '0000000000']))[0]?.id;
    }

    let subtotal = 0;
    let gstAmount = 0;
    let discountAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const productRows = await query(`SELECT * FROM products p JOIN inventory i ON i.product_id = p.id WHERE p.id = ?`, [item.productId]);
      const product = productRows[0];

      if (!product) {
        return res.status(404).json({ message: `Product not found for ID ${item.productId}.` });
      }

      const quantity = Number(item.quantity || 0);
      if (quantity <= 0) {
        return res.status(400).json({ message: `Quantity must be greater than zero for product ${product.name}.` });
      }

      if (product.current_stock < quantity) {
        return res.status(400).json({ message: `Insufficient stock for product ${product.name}.` });
      }

      const unitPrice = Number(item.unitPrice ?? product.selling_price ?? 0);
      const discount = Number(item.discount || 0);
      const gstRate = Number(product.gst_rate || 0);
      const amountBeforeTax = quantity * unitPrice;
      const taxableAmount = Math.max(amountBeforeTax - discount, 0);
      const gstValue = taxableAmount * (gstRate / 100);
      const lineTotal = taxableAmount + gstValue;

      subtotal += amountBeforeTax;
      gstAmount += gstValue;
      discountAmount += discount;

      processedItems.push({
        productId: product.id,
        quantity,
        unitPrice,
        gstRate,
        discountAmount: discount,
        amount: lineTotal,
      });
    }

    const invoiceNumber = await generateInvoiceNumber();
    const grandTotal = subtotal + gstAmount - discountAmount;
    const paidAmount = Number(req.body.paidAmount || grandTotal);
    const balanceAmount = Math.max(grandTotal - paidAmount, 0);

    const invoiceResult = await execute(
      `INSERT INTO invoices (
        invoice_number,
        invoice_type,
        order_id,
        customer_id,
        user_id,
        marketplace,
        payment_status,
        payment_method,
        coupon_code,
        subtotal,
        gst_amount,
        discount_amount,
        grand_total,
        paid_amount,
        balance_amount,
        notes,
        sales_person,
        invoice_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        invoiceNumber,
        normalizedType,
        orderId || null,
        customerIdValue,
        req.user?.id || 1,
        marketplace || null,
        paymentStatus || 'paid',
        paymentMethod || 'cash',
        couponCode || null,
        subtotal.toFixed(2),
        gstAmount.toFixed(2),
        discountAmount.toFixed(2),
        grandTotal.toFixed(2),
        paidAmount.toFixed(2),
        balanceAmount.toFixed(2),
        notes || null,
        salesPerson || req.user?.full_name || 'System',
      ]
    );

    const invoiceId = invoiceResult.insertId;

    for (const item of processedItems) {
      await execute(
        `INSERT INTO invoice_items (invoice_id, product_id, quantity, unit_price, gst_rate, discount_amount, amount)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [invoiceId, item.productId, item.quantity, item.unitPrice, item.gstRate, item.discountAmount, item.amount]
      );

      await execute(
        `UPDATE inventory SET current_stock = current_stock - ?, last_updated = NOW() WHERE product_id = ?`,
        [item.quantity, item.productId]
      );

      await execute(
        `INSERT INTO stock_history (product_id, movement_type, quantity, reference_type, reference_id, notes)
         VALUES (?, 'sale', ?, 'invoice', ?, ?)`,
        [item.productId, item.quantity, invoiceId, `Sale for invoice ${invoiceNumber}`]
      );
    }

    await execute(
      `INSERT INTO payments (invoice_id, method, amount, status) VALUES (?, ?, ?, 'success')`,
      [invoiceId, paymentMethod || 'cash', paidAmount.toFixed(2)]
    );

    return res.status(201).json({
      message: 'Invoice created successfully.',
      invoice: {
        id: invoiceId,
        invoiceNumber,
        invoiceType: normalizedType,
        grandTotal: grandTotal.toFixed(2),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getInvoices = async (req, res, next) => {
  try {
    const rows = await query(`
      SELECT i.*, c.customer_name, u.full_name AS salesperson
      FROM invoices i
      LEFT JOIN customers c ON c.id = i.customer_id
      LEFT JOIN users u ON u.id = i.user_id
      ORDER BY i.created_at DESC
    `);

    return res.status(200).json({ invoices: rows });
  } catch (error) {
    next(error);
  }
};
