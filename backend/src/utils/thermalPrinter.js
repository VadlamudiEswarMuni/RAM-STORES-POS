export const generateThermalReceiptText = ({
  companyName = 'RAM STORES',
  website = 'https://ramstores.in',
  address = 'Main Market, Hyderabad, Telangana',
  phone = '+91 98765 43210',
  gstNumber = '29ABCDE1234F1Z5',
  invoiceNumber = 'RAM-20260805-000001',
  invoiceType = 'offline',
  orderId,
  customerName = 'Walk-in Customer',
  couponCode,
  items = [],
  subtotal = 0,
  gst = 0,
  discount = 0,
  grandTotal = 0,
  paid = 0,
  balance = 0,
}) => {
  const lines = [];
  lines.push('================================');
  lines.push(companyName.toUpperCase());
  lines.push(website);
  lines.push(address);
  lines.push(`Phone: ${phone}`);
  lines.push(`GST: ${gstNumber}`);
  lines.push('--------------------------------');
  lines.push(`Invoice: ${invoiceNumber}`);
  lines.push(`Type: ${invoiceType.toUpperCase()}`);
  if (orderId) lines.push(`Order ID: ${orderId}`);
  lines.push(`Customer: ${customerName}`);
  if (couponCode) lines.push(`Coupon: ${couponCode}`);
  lines.push('--------------------------------');
  lines.push('ITEM      QTY   RATE   AMT');
  items.forEach((item) => {
    lines.push(`${item.name.slice(0, 10).padEnd(10)} ${String(item.quantity).padStart(3, ' ')} ${Number(item.unitPrice || 0).toFixed(2).padStart(7, ' ')} ${Number(item.amount || 0).toFixed(2).padStart(7, ' ')}`);
  });
  lines.push('--------------------------------');
  lines.push(`Subtotal: ${Number(subtotal).toFixed(2)}`);
  lines.push(`GST: ${Number(gst).toFixed(2)}`);
  lines.push(`Discount: ${Number(discount).toFixed(2)}`);
  lines.push(`Grand Total: ${Number(grandTotal).toFixed(2)}`);
  lines.push(`Paid: ${Number(paid).toFixed(2)}`);
  lines.push(`Balance: ${Number(balance).toFixed(2)}`);
  lines.push('--------------------------------');
  lines.push('Thank You');
  lines.push('Visit Again');
  lines.push('================================');
  return lines.join('\n');
};
