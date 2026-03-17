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
        "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm",
        className,
      )}
    >
      {title ? (
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      ) : null}
      {subtitle ? (
        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
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
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      {trend ? <p className="mt-2 text-xs text-slate-500">{trend}</p> : null}
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
      <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      ) : null}
    </div>
  );
}

const statusStyles: Record<
  "success" | "warning" | "danger" | "neutral",
  string
> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  danger: "border-rose-200 bg-rose-50 text-rose-700",
  neutral: "border-slate-200 bg-slate-100 text-slate-700",
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
    primary: "border-slate-900 bg-slate-900 text-white hover:bg-slate-800",
    secondary: "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    danger: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
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
