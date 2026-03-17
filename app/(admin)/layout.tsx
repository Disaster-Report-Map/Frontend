import React from "react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="w-full bg-white border-b dark:bg-gray-800">
        <div className="flex items-center justify-between max-w-6xl px-4 py-3 mx-auto">
          <Link href="/" className="font-bold">
            DRM Admin
          </Link>
          <nav className="flex gap-3">
            <Link href="/admin" className="px-3 py-1 rounded">
              Overview
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl px-4 py-6 mx-auto">{children}</main>
    </div>
  );
}
