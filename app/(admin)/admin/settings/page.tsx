import { Card, PageTitle } from "../../_components/AdminCard";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <PageTitle
        title="Settings"
        description="Configure categories, routing, and notification behavior."
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <Card title="Incident Categories">
          <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
              <span>Flood</span>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-600"
              />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
              <span>Fire</span>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-600"
              />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
              <span>Infrastructure</span>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-600"
              />
            </label>
          </div>
        </Card>

        <Card title="Agency Routing Rules">
          <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800">
              <p className="font-medium text-slate-900 dark:text-slate-100">Flood category</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Route to Flood Response Team and Water Safety Unit.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800">
              <p className="font-medium text-slate-900 dark:text-slate-100">Fire category</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Route to Urban Fire Service and medical backup.
              </p>
            </div>
          </div>
        </Card>

        <Card title="Notification Settings">
          <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
              <span>Email alerts</span>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-600"
              />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
              <span>In-app alerts</span>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-600"
              />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
              <span>Escalation reminders</span>
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-600"
              />
            </label>
          </div>
        </Card>
      </section>
    </div>
  );
}
