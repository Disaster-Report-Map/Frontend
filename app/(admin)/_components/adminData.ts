import {
  Bell,
  ChartSpline,
  Database,
  FileUp,
  LayoutDashboard,
  Settings,
  ShieldAlert,
  Users,
  UserCog,
} from "lucide-react";

export const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    label: "Incident Reports",
    href: "/admin/incident-reports",
    icon: ShieldAlert,
  },
  { label: "Agencies", href: "/admin/agencies", icon: UserCog },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
  { label: "Analytics", href: "/admin/analytics", icon: ChartSpline },
  { label: "Data Export", href: "/admin/data-export", icon: FileUp },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: Database },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];
