'use client';

import { IRentLogo } from "@/components/irent-logo";
import { ArrowLeft, Home, FileText, Wrench, Bell, DollarSign, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";

const bills = [
  { label: "June 2026 Rent", amount: "₱8,500", due: "Jun 5, 2026", status: "unpaid" },
  { label: "Water Utility — May", amount: "₱320", due: "May 30, 2026", status: "paid" },
  { label: "Electricity — May", amount: "₱1,150", due: "May 30, 2026", status: "paid" },
];

const requests = [
  { title: "AC not cooling properly", date: "May 29, 2026", status: "in-progress" },
  { title: "Ceiling light flickering", date: "May 10, 2026", status: "resolved" },
];

const statusConfig = {
  unpaid: { label: "Unpaid", color: "text-warning", bg: "bg-warning/10", icon: AlertTriangle },
  paid: { label: "Paid", color: "text-success", bg: "bg-success/10", icon: CheckCircle2 },
  "in-progress": { label: "In Progress", color: "text-brand", bg: "bg-brand/10", icon: Clock },
  resolved: { label: "Resolved", color: "text-success", bg: "bg-success/10", icon: CheckCircle2 },
};

export default function TenantPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between bg-card">
        <IRentLogo />
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        {/* Greeting */}
        <div className="rounded-xl border border-brand/30 bg-brand/5 p-6 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/20 text-brand text-lg font-bold">
            J
          </div>
          <div>
            <p className="text-xs font-mono text-brand mb-1 uppercase">Tenant Portal</p>
            <h1 className="text-xl font-bold text-foreground">Welcome back, Juan</h1>
            <p className="text-sm text-muted-foreground">Unit 201 — IRent Property, Quezon City</p>
          </div>
          <div className="ml-auto">
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-raised text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-warning border-2 border-background" />
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Rent Due", value: "₱8,500", color: "text-warning", icon: DollarSign },
            { label: "Requests", value: "1 active", color: "text-brand", icon: Wrench },
            { label: "Lease Ends", value: "Jan 2027", color: "text-success", icon: Home },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-4 text-center">
              <Icon className={`h-5 w-5 mx-auto mb-2 ${color}`} />
              <p className={`text-lg font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Bills */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-brand" />
              <h2 className="text-base font-bold text-foreground">My Bills</h2>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {bills.map((bill, i) => {
              const config = statusConfig[bill.status as keyof typeof statusConfig];
              const StatusIcon = config.icon;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-4 ${i < bills.length - 1 ? "border-b border-border" : ""} hover:bg-surface-raised transition-colors`}
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                    <StatusIcon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{bill.label}</p>
                    <p className="text-xs text-muted-foreground text-zinc-500">Due {bill.due}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-foreground">{bill.amount}</p>
                    <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
                  </div>
                  {bill.status === "unpaid" && (
                    <button className="ml-2 rounded-lg bg-brand px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-brand-glow transition-colors shrink-0">
                      Pay Now
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Maintenance */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-brand" />
              <h2 className="text-base font-bold text-foreground">Maintenance Requests</h2>
            </div>
            <button className="rounded-lg border border-brand/40 bg-brand/10 px-3 py-1.5 text-xs font-bold text-brand hover:bg-brand/20 transition-colors">
              + New Request
            </button>
          </div>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {requests.map((req, i) => {
              const config = statusConfig[req.status as keyof typeof statusConfig];
              const StatusIcon = config.icon;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-4 ${i < requests.length - 1 ? "border-b border-border" : ""} hover:bg-surface-raised transition-colors`}
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                    <StatusIcon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{req.title}</p>
                    <p className="text-xs text-muted-foreground text-zinc-500">{req.date}</p>
                  </div>
                  <span className={`text-xs font-semibold rounded-full px-2.5 py-1 ${config.bg} ${config.color} shrink-0`}>
                    {config.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
