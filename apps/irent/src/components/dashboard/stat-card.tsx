'use client';

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  icon: LucideIcon;
  variant?: "default" | "warning" | "danger" | "success";
  onClick?: () => void;
}

const variantStyles = {
  default: {
    iconBg: "bg-brand/15",
    iconColor: "text-brand",
    trendColor: "text-success",
  },
  warning: {
    iconBg: "bg-warning/15",
    iconColor: "text-warning",
    trendColor: "text-warning",
  },
  danger: {
    iconBg: "bg-destructive/15",
    iconColor: "text-destructive",
    trendColor: "text-destructive",
  },
  success: {
    iconBg: "bg-success/15",
    iconColor: "text-success",
    trendColor: "text-success",
  },
};

export function StatCard({ title, value, trend, icon: Icon, variant = "default", onClick }: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-xl border border-border bg-card p-5 transition-all hover:border-muted-foreground/30 hover:bg-surface-raised focus:outline-none focus:ring-2 focus:ring-ring"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${styles.iconBg}`}>
          <Icon className={`h-5 w-5 ${styles.iconColor}`} />
        </div>
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{title}</span>
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold text-foreground tabular-nums">{value}</p>
        <p className={`text-xs font-medium ${styles.trendColor}`}>{trend}</p>
      </div>
    </button>
  );
}
