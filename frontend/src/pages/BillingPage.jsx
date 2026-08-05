import { useState } from 'react';

const defaultItems = [
  { id: 1, productId: 1, name: 'Samsung USB Cable', quantity: 1, unitPrice: 299, discount: 0 },
  { id: 2, productId: 2, name: 'Philips Bulb 9W', quantity: 2, unitPrice: 199, discount: 10 },
];

export default function BillingPage() {
  const [invoiceType, setInvoiceType] = useState('offline');
  const [customerName, setCustomerName] = useState('');
  const [orderId, setOrderId] = useState('');
  const [items, setItems] = useState(defaultItems);

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const gst = subtotal * 0.12;
  const total = subtotal + gst;

  const addItem = () => {
    setItems((prev) => [...prev, { id: Date.now(), productId: 3, name: 'New Item', quantity: 1, unitPrice: 0, discount: 0 }]);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Create Invoice</h2>
          <div className="flex gap-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setInvoiceType('offline')}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${invoiceType === 'offline' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500'}`}
            >
              Offline
            </button>
            <button
              type="button"
              onClick={() => setInvoiceType('online')}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${invoiceType === 'online' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500'}`}
            >
              Online
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Customer name"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          />
          <input
            placeholder="Phone"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          />
          <input
            placeholder="Address"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 md:col-span-2"
          />
          {invoiceType === 'online' ? (
            <>
              <input
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Order ID"
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
              />
              <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <option>Marketplace</option>
                <option>Amazon</option>
                <option>Flipkart</option>
                <option>WhatsApp</option>
                <option>Instagram</option>
              </select>
            </>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-soft">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Products</h3>
          <button onClick={addItem} className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-white">
            Add Item
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="grid gap-3 rounded-xl border border-slate-200 p-3 md:grid-cols-5">
              <input value={item.name} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2" />
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((entry) =>
                      entry.id === item.id ? { ...entry, quantity: Number(e.target.value) } : entry
                    )
                  )
                }
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
              />
              <input
                type="number"
                value={item.unitPrice}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((entry) =>
                      entry.id === item.id ? { ...entry, unitPrice: Number(e.target.value) } : entry
                    )
                  )
                }
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
              />
              <input
                type="number"
                value={item.discount}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((entry) =>
                      entry.id === item.id ? { ...entry, discount: Number(e.target.value) } : entry
                    )
                  )
                }
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
              />
              <div className="flex items-center justify-end text-sm font-semibold text-slate-700">
                ₹{(item.quantity * item.unitPrice).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Subtotal</div>
            <div className="text-2xl font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">GST</div>
            <div className="text-2xl font-bold text-slate-900">₹{gst.toLocaleString('en-IN')}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Grand Total</div>
            <div className="text-3xl font-bold text-brand-600">₹{total.toLocaleString('en-IN')}</div>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button className="rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white">Print & Save</button>
        </div>
      </div>
    </div>
  );
}
