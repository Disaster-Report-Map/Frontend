import {
  ActionButton,
  Card,
  PageTitle,
  StatusBadge,
} from "../../_components/AdminCard";
import { AdminTable } from "../../_components/AdminTable";

const agencies = [
  {
    name: "Rapid Medical Unit",
    category: "Medical",
    contact: "rmu@agency.org",
    status: "Active",
    activeIncidents: 13,
  },
  {
    name: "Urban Fire Service",
    category: "Fire",
    contact: "ufs@agency.org",
    status: "Trial",
    activeIncidents: 21,
  },
  {
    name: "Flood Response Team",
    category: "Flood",
    contact: "frt@agency.org",
    status: "Inactive",
    activeIncidents: 4,
  },
];

export default function AgenciesPage() {
  return (
    <div className="space-y-6">
      <PageTitle
        title="Agencies"
        description="Monitor partner agencies and response capacities."
      />

      <Card title="Agency Directory">
        <AdminTable
          rows={agencies}
          columns={[
            {
              key: "name",
              title: "Agency Name",
              render: (row) => (
                <span className="font-medium text-slate-900">{row.name}</span>
              ),
            },
            {
              key: "category",
              title: "Category",
              render: (row) => row.category,
            },
            {
              key: "contact",
              title: "Contact Info",
              render: (row) => row.contact,
            },
            {
              key: "status",
              title: "Subscription Status",
              render: (row) => (
                <StatusBadge
                  label={row.status}
                  tone={
                    row.status === "Active"
                      ? "success"
                      : row.status === "Trial"
                        ? "warning"
                        : "danger"
                  }
                />
              ),
            },
            {
              key: "activeIncidents",
              title: "Active Incident Count",
              render: (row) => row.activeIncidents,
            },
            {
              key: "actions",
              title: "Actions",
              render: () => (
                <div className="flex flex-wrap gap-2">
                  <ActionButton>View</ActionButton>
                  <ActionButton>Edit</ActionButton>
                  <ActionButton variant="danger">Deactivate</ActionButton>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
