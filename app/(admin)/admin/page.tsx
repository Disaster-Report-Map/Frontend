import {
  ActionButton,
  Card,
  PageTitle,
  StatCard,
  StatusBadge,
} from "../_components/AdminCard";
import { AdminTable } from "../_components/AdminTable";

const reports = [
  {
    id: "IR-1024",
    title: "River Flooding in East Zone",
    category: "Flood",
    location: "East Zone",
    status: "Active",
    time: "08:12 AM",
  },
  {
    id: "IR-1025",
    title: "Wildfire Near Hill Valley",
    category: "Fire",
    location: "Hill Valley",
    status: "Pending",
    time: "08:45 AM",
  },
  {
    id: "IR-1026",
    title: "Road Collapse on A-24",
    category: "Infrastructure",
    location: "A-24 Corridor",
    status: "Resolved",
    time: "09:30 AM",
  },
  {
    id: "IR-1027",
    title: "Storm Damage in North District",
    category: "Storm",
    location: "North District",
    status: "Active",
    time: "10:02 AM",
  },
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <PageTitle
        title="Operations Dashboard"
        description="High-level view of incident activity and report flow."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Incidents"
          value="1,248"
          trend="+12% vs last week"
        />
        <StatCard
          label="Active Incidents"
          value="84"
          trend="Needs immediate triage"
        />
        <StatCard
          label="Resolved Incidents"
          value="1,009"
          trend="81% resolution rate"
        />
        <StatCard
          label="New Reports Today"
          value="73"
          trend="+8 since last hour"
        />
      </section>

      <Card title="Live Incident Map" subtitle="Geospatial monitor placeholder">
        <div className="relative h-72 overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200 sm:h-80">
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-px opacity-50">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="bg-white/50" />
            ))}
          </div>
          <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-700 shadow-sm">
            LIVE
          </div>
        </div>
      </Card>

      <Card
        title="Recent Reports"
        subtitle="Latest submissions awaiting review"
      >
        <AdminTable
          rows={reports}
          columns={[
            {
              key: "id",
              title: "ID",
              render: (row) => (
                <span className="font-medium text-slate-900">{row.id}</span>
              ),
            },
            { key: "title", title: "Title", render: (row) => row.title },
            {
              key: "category",
              title: "Category",
              render: (row) => row.category,
            },
            {
              key: "location",
              title: "Location",
              render: (row) => row.location,
            },
            {
              key: "status",
              title: "Status",
              render: (row) => (
                <StatusBadge
                  label={row.status}
                  tone={
                    row.status === "Resolved"
                      ? "success"
                      : row.status === "Pending"
                        ? "warning"
                        : "danger"
                  }
                />
              ),
            },
            { key: "time", title: "Time", render: (row) => row.time },
            {
              key: "actions",
              title: "Actions",
              render: () => (
                <div className="flex flex-wrap gap-2">
                  <ActionButton>View</ActionButton>
                  <ActionButton variant="primary">Approve</ActionButton>
                  <ActionButton variant="danger">Reject</ActionButton>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
