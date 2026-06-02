'use client';

import { useState } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { InsightCard } from "@/components/dashboard/insight-card";
import { IRentLogo } from "@/components/irent-logo";
import {
  Building2,
  FileText,
  AlertOctagon,
  DollarSign,
  Brain,
  Bell,
  Settings,
  Users,
  ChevronRight,
  BarChart3,
  Home,
  LogOut,
  Mail,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    title: "Occupancy",
    value: "85%",
    trend: "+5% vs last month",
    icon: Building2,
    variant: "success" as const,
  },
  {
    title: "Pending Bills",
    value: 4,
    trend: "Due in 3 days",
    icon: FileText,
    variant: "warning" as const,
  },
  {
    title: "Urgent Reports",
    value: 2,
    trend: "Requires attention",
    icon: AlertOctagon,
    variant: "danger" as const,
  },
  {
    title: "Monthly Revenue",
    value: "₱125,000",
    trend: "+12% YoY",
    icon: DollarSign,
    variant: "default" as const,
  },
];

const insights = [
  {
    type: "Utility Warning",
    message: "Room 302 has used 40% more electricity than their 6-month average. Possible appliance leak or unauthorized heater.",
    reasoning: "Common sense: Sudden spikes in usage without seasonal changes often indicate equipment failure or policy violation. Recommend a physical inspection within 48 hours to rule out hazardous usage.",
  },
  {
    type: "Occupancy Prediction",
    message: "Projected 100% occupancy next month based on current pipeline.",
    reasoning: "Deep thinking: 3 pending move-in invitations have been accepted but not yet contracted. Combined with the area's low vacancy index this season, full occupancy is statistically likely by month-end.",
  },
  {
    type: "Maintenance Priority",
    message: "Replace AC filter in Room 105 before summer peak season.",
    reasoning: "Preventive logic: Last filter maintenance was 5 months ago. Historical data from similar units shows filter replacement at this interval prevents 3x higher compressor repair costs during peak summer usage.",
  },
];

const recentActivity = [
  { label: "New tenant invitation sent", sub: "Unit 201 — John Dela Cruz", time: "2h ago", dot: "bg-brand" },
  { label: "Rent payment received", sub: "Unit 302 — ₱8,500", time: "5h ago", dot: "bg-success" },
  { label: "Maintenance request filed", sub: "Unit 105 — AC not cooling", time: "1d ago", dot: "bg-warning" },
  { label: "Lease expiry approaching", sub: "Unit 404 — 14 days left", time: "2d ago", dot: "bg-destructive" },
];

const navItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard", active: true },
  { icon: Building2, label: "Units", href: "#" },
  { icon: Users, label: "Tenants", href: "#" },
  { icon: FileText, label: "Billing", href: "#" },
  { icon: BarChart3, label: "Reports", href: "#" },
  { icon: Mail, label: "Invitations", href: "/tenants/new" },
  { icon: Settings, label: "Settings", href: "#" },
];

export default function DashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar">
        <div className="p-5 border-b border-sidebar-border">
          <IRentLogo size="large" />
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, href, active }) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand/15 text-brand"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/20 text-brand text-sm font-bold">
              O
            </div>
            <div className="flex-1 min-w-0 text-white">
              <p className="text-sm font-medium truncate text-foreground">Owner Admin</p>
              <p className="text-xs text-muted-foreground truncate">admin@irent.ph</p>
            </div>
            <LogOut className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4 shrink-0">
          <div>
            <h1 className="text-xl font-bold text-foreground">Owner Dashboard</h1>
            <p className="text-xs text-muted-foreground">Monday, June 2, 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-raised px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <div className="flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1.5 text-xs font-mono text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
              Jules AI: Deep Thinking Active
            </div>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-raised text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-destructive border-2 border-background" />
            </button>
          </div>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* AI Insights */}
            <section className="xl:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-brand" />
                  <h2 className="text-base font-bold text-foreground">Common Sense Insights</h2>
                  <span className="rounded-full bg-brand/15 px-2 py-0.5 text-xs font-mono text-brand">
                    {insights.length} active
                  </span>
                </div>
                <span className="text-xs font-mono text-muted-foreground">REASONING ENGINE V1</span>
              </div>

              <div className="space-y-3">
                {insights.map((insight, i) => (
                  <InsightCard key={i} {...insight} />
                ))}
              </div>
            </section>

            {/* Activity feed */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-foreground">Recent Activity</h2>
                <button className="flex items-center gap-1 text-xs text-brand hover:text-brand-glow transition-colors">
                  View all <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              <div className="rounded-xl border border-border bg-card overflow-hidden">
                {recentActivity.map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-4 ${
                      i < recentActivity.length - 1 ? "border-b border-border" : ""
                    } hover:bg-surface-raised transition-colors cursor-pointer`}
                  >
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full">
                      <span className={`block h-2 w-2 rounded-full ${item.dot}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground leading-snug">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="mt-4 space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { icon: Mail, label: "Send Tenant Invite", href: "/tenants/new", color: "text-brand" },
                    { icon: FileText, label: "Generate Bill", href: "#", color: "text-warning" },
                    { icon: AlertOctagon, label: "View Reports", href: "#", color: "text-destructive" },
                  ].map(({ icon: Icon, label, href, color }) => (
                    <Link
                      key={label}
                      href={href}
                      className="flex items-center gap-3 rounded-lg border border-border bg-surface-raised px-4 py-3 text-sm font-medium text-foreground hover:bg-accent hover:border-muted-foreground/30 transition-all"
                    >
                      <Icon className={`h-4 w-4 ${color}`} />
                      {label}
                      <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
