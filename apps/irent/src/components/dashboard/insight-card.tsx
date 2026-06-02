'use client';

import { AlertTriangle, TrendingUp, Wrench, ChevronRight, Brain } from "lucide-react";
import { useState } from "react";

interface InsightProps {
  type: string;
  message: string;
  reasoning: string;
}

const typeConfig: Record<string, {
  icon: typeof AlertTriangle;
  border: string;
  bg: string;
  badge: string;
  badgeText: string;
  dot: string;
}> = {
  "Utility Warning": {
    icon: AlertTriangle,
    border: "border-l-warning",
    bg: "bg-warning/5",
    badge: "bg-warning/15 text-warning",
    badgeText: "WARNING",
    dot: "bg-warning",
  },
  "Occupancy Prediction": {
    icon: TrendingUp,
    border: "border-l-brand",
    bg: "bg-brand/5",
    badge: "bg-brand/15 text-brand",
    badgeText: "FORECAST",
    dot: "bg-brand",
  },
  "Maintenance Priority": {
    icon: Wrench,
    border: "border-l-success",
    bg: "bg-success/5",
    badge: "bg-success/15 text-success",
    badgeText: "PREVENTIVE",
    dot: "bg-success",
  },
};

export function InsightCard({ type, message, reasoning }: InsightProps) {
  const [expanded, setExpanded] = useState(false);
  const config = typeConfig[type] ?? typeConfig["Occupancy Prediction"];
  const Icon = config.icon;

  return (
    <div className={`rounded-xl border border-border border-l-4 ${config.border} ${config.bg} overflow-hidden`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 flex items-start gap-4 group"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-card border border-border">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-mono font-bold ${config.badge}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
              {config.badgeText}
            </span>
            <span className="text-xs font-mono text-muted-foreground">JULES AI · REASONING ENGINE</span>
          </div>
          <p className="text-sm font-medium text-foreground leading-relaxed">{message}</p>
        </div>

        <ChevronRight
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 mt-1 ${expanded ? "rotate-90" : ""}`}
        />
      </button>

      {expanded && (
        <div className="px-5 pb-5">
          <div className="rounded-lg border border-border bg-surface-sunken p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-3.5 w-3.5 text-brand" />
              <span className="text-xs font-mono text-brand uppercase tracking-wider">Logic Trace</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{reasoning}</p>
          </div>
        </div>
      )}
    </div>
  );
}
