export default function SettingsPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl bg-white p-5 shadow-soft">
        <h2 className="mb-4 text-xl font-bold text-slate-900">Store Settings</h2>
        <div className="space-y-4">
          <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" defaultValue="RAM STORES" />
          <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" defaultValue="Main Market, Hyderabad" />
          <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" defaultValue="+91 98765 43210" />
          <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" defaultValue="29ABCDE1234F1Z5" />
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-soft">
        <h2 className="mb-4 text-xl font-bold text-slate-900">Printer & Security</h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
            <span>Enable dark mode</span>
            <input type="checkbox" defaultChecked />
          </label>
          <label className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
            <span>Auto print receipt</span>
            <input type="checkbox" defaultChecked />
          </label>
          <label className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
            <span>Require manager approval</span>
            <input type="checkbox" />
          </label>
        </div>
      </div>
    </div>
  );
}
