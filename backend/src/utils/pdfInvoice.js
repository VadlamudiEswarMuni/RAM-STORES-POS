import PDFDocument from 'pdfkit';
import fs from 'fs';

export const generateInvoicePdf = async (invoice, filePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);
    doc.fontSize(20).text('RAM STORES', { align: 'center' });
    doc.fontSize(10).text('https://ramstores.in', { align: 'center' });
    doc.text('Main Market, Hyderabad, Telangana');
    doc.text(`Phone: +91 98765 43210`);
    doc.text(`GST: 29ABCDE1234F1Z5`);
    doc.moveDown();
    doc.text(`Invoice: ${invoice.invoice_number || invoice.invoiceNumber || 'N/A'}`);
    doc.text(`Type: ${(invoice.invoice_type || invoice.invoiceType || 'offline').toUpperCase()}`);
    doc.text(`Customer: ${invoice.customer_name || invoice.customerName || 'Walk-in Customer'}`);
    doc.text(`Payment Method: ${invoice.payment_method || invoice.paymentMethod || 'Cash'}`);
    doc.moveDown();
    doc.text('Products', { underline: true });

    const items = invoice.items || [];
    items.forEach((item) => {
      doc.text(`${item.name || 'Item'} - Qty: ${item.quantity || 0} - Rate: ₹${Number(item.unit_price || item.unitPrice || 0).toFixed(2)} - Amount: ₹${Number(item.amount || 0).toFixed(2)}`);
    });

    doc.moveDown();
    doc.text(`Subtotal: ₹${Number(invoice.subtotal || 0).toFixed(2)}`);
    doc.text(`GST: ₹${Number(invoice.gst_amount || invoice.gstAmount || 0).toFixed(2)}`);
    doc.text(`Discount: ₹${Number(invoice.discount_amount || invoice.discountAmount || 0).toFixed(2)}`);
    doc.text(`Grand Total: ₹${Number(invoice.grand_total || invoice.grandTotal || 0).toFixed(2)}`);
    doc.text('Thank You for shopping with RAM STORES');
    doc.end();

    stream.on('finish', resolve);
    stream.on('error', reject);
  });
};
