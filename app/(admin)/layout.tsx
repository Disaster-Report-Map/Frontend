"use client";

import React from "react";
import AdminNavbar from "./_components/AdminNavbar";
import AdminSidebar from "./_components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const [isDesktopCollapsed, setDesktopCollapsed] = React.useState(false);
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("admin-theme") as
      | "light"
      | "dark"
      | null;
    const savedSidebar = localStorage.getItem("admin-sidebar-collapsed");

    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    }

    if (savedSidebar === "true") {
      setDesktopCollapsed(true);
    }
  }, []);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("admin-theme", theme);
  }, [theme]);

  React.useEffect(() => {
    localStorage.setItem("admin-sidebar-collapsed", String(isDesktopCollapsed));
  }, [isDesktopCollapsed]);

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="fixed inset-0 -z-10 bg-slate-50 dark:bg-slate-950" />
      <div className="flex min-h-screen">
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isDesktopCollapsed={isDesktopCollapsed}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminNavbar
            onMenuClick={() => setSidebarOpen(true)}
            isDesktopCollapsed={isDesktopCollapsed}
            onToggleDesktopCollapse={() =>
              setDesktopCollapsed((previous) => !previous)
            }
            theme={theme}
            onToggleTheme={() =>
              setTheme((previous) => (previous === "dark" ? "light" : "dark"))
            }
          />
          <main className="flex-1 p-4 sm:p-6">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
