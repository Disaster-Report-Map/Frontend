import {
  ActionButton,
  Card,
  PageTitle,
  StatusBadge,
} from "../../_components/AdminCard";
import { AdminTable } from "../../_components/AdminTable";

const subscriptions = [
  {
    agency: "Rapid Medical Unit",
    plan: "Enterprise",
    billing: "Annual",
    status: "Active",
  },
  {
    agency: "Urban Fire Service",
    plan: "Growth",
    billing: "Monthly",
    status: "Suspended",
  },
  {
    agency: "Flood Response Team",
    plan: "Starter",
    billing: "Monthly",
    status: "Pending",
  },
];

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <PageTitle
        title="Subscriptions"
        description="Track and manage agency billing plans."
      />

      <Card title="Agency Plans">
        <AdminTable
          rows={subscriptions}
          columns={[
            {
              key: "agency",
              title: "Agency",
              render: (row) => (
                <span className="font-medium text-slate-900">{row.agency}</span>
              ),
            },
            { key: "plan", title: "Plan", render: (row) => row.plan },
            {
              key: "billing",
              title: "Billing Cycle",
              render: (row) => row.billing,
            },
            {
              key: "status",
              title: "Status",
              render: (row) => (
                <StatusBadge
                  label={row.status}
                  tone={
                    row.status === "Active"
                      ? "success"
                      : row.status === "Pending"
                        ? "warning"
                        : "danger"
                  }
                />
              ),
            },
            {
              key: "actions",
              title: "Actions",
              render: () => (
                <div className="flex flex-wrap gap-2">
                  <ActionButton variant="primary">Upgrade</ActionButton>
                  <ActionButton>Activate</ActionButton>
                  <ActionButton variant="danger">Suspend</ActionButton>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
