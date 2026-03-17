import { ActionButton, Card, PageTitle, StatusBadge } from '../../_components/AdminCard'
import { AdminTable } from '../../_components/AdminTable'

const users = [
  { id: 'USR-901', name: 'Sarah Adebayo', email: 'sarah@example.com', reports: 17, status: 'Active' },
  { id: 'USR-902', name: 'Daniel Mensah', email: 'daniel@example.com', reports: 3, status: 'Flagged' },
  { id: 'USR-903', name: 'Eleanor Grant', email: 'eleanor@example.com', reports: 9, status: 'Suspended' },
]

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Users" description="Manage user accounts and moderation actions." />

      <Card title="User Accounts">
        <AdminTable
          rows={users}
          columns={[
            { key: 'id', title: 'User ID', render: (row) => <span className="font-medium text-slate-900">{row.id}</span> },
            { key: 'name', title: 'Name', render: (row) => row.name },
            { key: 'email', title: 'Email', render: (row) => row.email },
            { key: 'reports', title: 'Reports Submitted', render: (row) => row.reports },
            {
              key: 'status',
              title: 'Account Status',
              render: (row) => (
                <StatusBadge
                  label={row.status}
                  tone={row.status === 'Active' ? 'success' : row.status === 'Flagged' ? 'warning' : 'danger'}
                />
              ),
            },
            {
              key: 'actions',
              title: 'Actions',
              render: () => (
                <div className="flex flex-wrap gap-2">
                  <ActionButton variant="danger">Suspend</ActionButton>
                  <ActionButton variant="danger">Delete</ActionButton>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  )
}
