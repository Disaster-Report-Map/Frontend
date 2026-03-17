import { Card, PageTitle, StatCard } from "../../_components/AdminCard";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <PageTitle
        title="Notifications"
        description="Compose and broadcast messages to your target audience."
      />

      <Card title="Broadcast Message">
        <form className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Title
              </label>
              <input
                className="w-full admin-input"
                placeholder="Enter notification title"
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Message
              </label>
              <textarea
                rows={4}
                className="w-full admin-textarea"
                placeholder="Enter message details"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Target Audience
              </label>
              <select className="w-full admin-select">
                <option>All</option>
                <option>Agencies</option>
                <option>Users</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Delivery Method
              </label>
              <select className="w-full admin-select">
                <option>Email</option>
                <option>In-App</option>
              </select>
            </div>
          </div>
          <button
            type="button"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            Send Broadcast
          </button>
        </form>
      </Card>

      <Card title="Broadcast Progress">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Delivery in progress</span>
            <span>72%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-[72%] rounded-full bg-slate-900" />
          </div>
        </div>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Targets" value="12,400" />
        <StatCard label="Delivered" value="8,915" />
        <StatCard label="Pending" value="2,601" />
        <StatCard label="Failed" value="884" />
      </section>
    </div>
  );
}
