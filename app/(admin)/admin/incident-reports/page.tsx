import {
  ActionButton,
  Card,
  PageTitle,
  StatusBadge,
} from "../../_components/AdminCard";
import { AdminTable } from "../../_components/AdminTable";

const rows = [
  {
    id: "IR-3021",
    title: "Bridge Fire Alert",
    category: "Fire",
    location: "Lake Bridge",
    status: "Active",
    timestamp: "2026-03-17 10:22",
  },
  {
    id: "IR-3022",
    title: "Flash Flood Warning",
    category: "Flood",
    location: "South Basin",
    status: "Pending",
    timestamp: "2026-03-17 09:54",
  },
  {
    id: "IR-3023",
    title: "Power Grid Failure",
    category: "Infrastructure",
    location: "Central City",
    status: "Resolved",
    timestamp: "2026-03-16 21:04",
  },
];

export default function IncidentReportsPage() {
  return (
    <div className="space-y-6">
      <PageTitle
        title="Incident Reports"
        description="Review, approve, and manage all incoming reports."
      />

      <Card title="Filters">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400">
            <option>All Categories</option>
            <option>Fire</option>
            <option>Flood</option>
            <option>Storm</option>
          </select>
          <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400">
            <option>All Status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Resolved</option>
          </select>
          <input
            type="date"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
          />
          <input
            type="date"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
          />
          <input
            type="search"
            placeholder="Search reports..."
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-400"
          />
        </div>
      </Card>

      <Card title="All Incident Reports">
        <AdminTable
          rows={rows}
          columns={[
            {
              key: "id",
              title: "Report ID",
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
            {
              key: "timestamp",
              title: "Timestamp",
              render: (row) => row.timestamp,
            },
            {
              key: "actions",
              title: "Actions",
              render: () => (
                <div className="flex flex-wrap gap-2">
                  <ActionButton>View</ActionButton>
                  <ActionButton>Edit</ActionButton>
                  <ActionButton variant="danger">Delete</ActionButton>
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
