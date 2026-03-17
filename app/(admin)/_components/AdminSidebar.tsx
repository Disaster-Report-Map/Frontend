"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { navItems } from "./adminData";
import { cn } from "./utils";

type AdminSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  isDesktopCollapsed: boolean;
};

export default function AdminSidebar({
  isOpen,
  onClose,
  isDesktopCollapsed,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-200 lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 border-r border-slate-200 bg-white p-4 transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 lg:static lg:z-0 lg:translate-x-0",
          isDesktopCollapsed ? "lg:w-20" : "lg:w-72",
          "w-72",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header section - hidden on desktop collapse */}
        <div className={cn(isDesktopCollapsed && "lg:hidden")}>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Disaster Response
          </p>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Admin Panel
          </h2>
        </div>

        {/* Collapsed badge - shown only when desktop collapsed */}
        <div
          className={cn(
            "hidden h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-xs font-semibold text-white lg:flex",
            !isDesktopCollapsed && "lg:hidden",
          )}
        >
          AD
        </div>

        {/* Close button - mobile only */}
        <button
          type="button"
          className="rounded-lg border border-slate-200 p-2 text-slate-500 dark:border-slate-700 dark:text-slate-400 lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive =
              href === "/admin"
                ? pathname === href
                : pathname === href || pathname.startsWith(href + "/");

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isDesktopCollapsed && "lg:justify-center lg:px-2",
                  isActive
                    ? "bg-slate-900 text-white shadow-sm dark:bg-slate-800"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100",
                )}
                title={isDesktopCollapsed ? label : undefined}
              >
                <Icon className="h-4 w-4" />
                <span className={cn(isDesktopCollapsed && "lg:hidden")}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
