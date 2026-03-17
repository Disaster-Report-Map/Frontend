"use client";

import {
  Bell,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sun,
} from "lucide-react";
import { usePathname } from "next/navigation";

const titleMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/incident-reports": "Incident Reports",
  "/admin/agencies": "Agencies",
  "/admin/users": "Users",
  "/admin/notifications": "Notifications",
  "/admin/analytics": "Analytics",
  "/admin/data-export": "Data Export",
  "/admin/subscriptions": "Subscriptions",
  "/admin/settings": "Settings",
};

export default function AdminNavbar({
  onMenuClick,
  isDesktopCollapsed,
  onToggleDesktopCollapse,
  theme,
  onToggleTheme,
}: {
  onMenuClick: () => void;
  isDesktopCollapsed: boolean;
  onToggleDesktopCollapse: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}) {
  const pathname = usePathname();
  const title = titleMap[pathname] || "Admin";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onToggleDesktopCollapse}
          className="hidden rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 lg:inline-flex"
          aria-label="Toggle desktop sidebar"
        >
          {isDesktopCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </p>
          <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
            Disaster response management
          </p>
        </div>

        <label className="hidden w-full max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 md:flex">
          <Search className="h-4 w-4" />
          <input
            type="search"
            placeholder="Search incidents, agencies, users..."
            className="w-full bg-transparent outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </label>

        <button
          type="button"
          onClick={onToggleTheme}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        <button
          type="button"
          className="relative rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-slate-200 p-1 pr-3 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            AD
          </span>
          <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 sm:block">
            Admin
          </span>
        </button>
      </div>
    </header>
  );
}
