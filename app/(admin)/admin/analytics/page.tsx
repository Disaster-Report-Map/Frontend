import { Card, PageTitle, StatCard } from "../../_components/AdminCard";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageTitle
        title="Analytics"
        description="Operational trends, distribution heat, and response performance."
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <Card title="Incident Categories" subtitle="Bar chart placeholder">
          <div className="flex h-52 items-end gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            {[42, 65, 28, 54, 36, 71].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-t-lg bg-slate-900/80"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </Card>

        <Card title="Trend Graph" subtitle="Timeline placeholder">
          <div className="h-52 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="relative h-full w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
              <svg viewBox="0 0 400 160" className="h-full w-full">
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-slate-900"
                  points="0,120 40,110 80,116 120,90 160,95 200,72 240,84 280,60 320,66 360,44 400,52"
                />
              </svg>
            </div>
          </div>
        </Card>
      </section>

      <Card title="Heatmap" subtitle="Grid placeholder">
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-12">
          {Array.from({ length: 48 }).map((_, i) => (
            <div
              key={i}
              className={`h-8 rounded-md ${i % 5 === 0 ? "bg-rose-200" : i % 3 === 0 ? "bg-amber-200" : "bg-emerald-200"}`}
            />
          ))}
        </div>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Avg. Response Time" value="12m 40s" />
        <StatCard label="Median Dispatch" value="6m 12s" />
        <StatCard label="Escalation Rate" value="14%" />
        <StatCard label="Resolved in 24h" value="89%" />
      </section>
    </div>
  );
}
