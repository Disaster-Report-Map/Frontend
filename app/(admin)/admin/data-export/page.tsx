import { Card, PageTitle } from "../../_components/AdminCard";

export default function DataExportPage() {
  return (
    <div className="space-y-6">
      <PageTitle
        title="Data Export"
        description="Generate exports for reporting and external analysis."
      />

      <Card title="Export Filters">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input type="date" className="admin-input" />
          <input type="date" className="admin-input" />
          <select className="admin-select">
            <option>All Categories</option>
            <option>Fire</option>
            <option>Flood</option>
            <option>Storm</option>
          </select>
        </div>
      </Card>

      <Card title="Export Format">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Export CSV
          </button>
          <button
            type="button"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            Export JSON
          </button>
        </div>
      </Card>
    </div>
  );
}
