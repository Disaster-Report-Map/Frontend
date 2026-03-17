import React from "react";
import { cn } from "./utils";

type CardProps = {
  title?: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
};

export function Card({ title, subtitle, className, children }: CardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900",
        className,
      )}
    >
      {title ? (
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      ) : null}
      {subtitle ? (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
      ) : null}
      <div className={title || subtitle ? "mt-4" : ""}>{children}</div>
    </section>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  trend?: string;
};

export function StatCard({ label, value, trend }: StatCardProps) {
  return (
    <Card className="p-4 sm:p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
      {trend ? <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{trend}</p> : null}
    </Card>
  );
}

export function PageTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 sm:text-2xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      ) : null}
    </div>
  );
}

const statusStyles: Record<
  "success" | "warning" | "danger" | "neutral",
  string
> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  warning: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  danger: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300",
  neutral: "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300",
};

export function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: "success" | "warning" | "danger" | "neutral";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        statusStyles[tone],
      )}
    >
      {label}
    </span>
  );
}

export function ActionButton({
  children,
  variant = "secondary",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
}) {
const variants: Record<typeof variant, string> = {
    primary: "border-slate-900 bg-slate-900 text-white hover:bg-slate-800 dark:border-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600",
    secondary: "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
    danger: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300 dark:hover:bg-rose-900",
  };

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors duration-200",
        variants[variant],
      )}
    >
      {children}
    </button>
  );
}
