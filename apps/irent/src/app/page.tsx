import Link from "next/link";
import { IRentLogo } from "@/components/irent-logo";
import { Shield, Brain, TrendingUp, Building2, Zap, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border/50 px-6 py-4 flex items-center justify-between">
        <IRentLogo />
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-mono text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
            Jules AI Active
          </span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/5 px-4 py-1.5 text-sm text-brand">
          <Brain className="h-4 w-4" />
          <span>AI-Powered Property Intelligence</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-foreground text-balance leading-none mb-6">
          Manage smarter.
          <br />
          <span className="text-brand">Think deeper.</span>
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground leading-relaxed mb-12 text-pretty">
          IRent is the command center for modern property owners — with proactive AI insights, real-time anomaly detection, and a seamless tenant experience.
        </p>

        {/* Login cards */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
          <Link
            href="/login"
            className="group flex-1 flex flex-col items-center gap-3 rounded-xl border border-brand/40 bg-brand/10 p-6 transition-all hover:bg-brand/20 hover:border-brand/70 hover:shadow-[0_0_24px_rgba(99,102,241,0.15)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/20 text-brand group-hover:bg-brand/30 transition-colors">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Owner Portal</p>
              <p className="text-sm text-muted-foreground">Command Center Access</p>
            </div>
            <div className="w-full mt-1 rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-primary-foreground text-center group-hover:bg-brand-glow transition-colors">
              Owner Login
            </div>
          </Link>

          <Link
            href="/login/tenant"
            className="group flex-1 flex flex-col items-center gap-3 rounded-xl border border-border bg-surface-raised p-6 transition-all hover:border-muted-foreground/40 hover:bg-accent"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-muted-foreground group-hover:text-foreground transition-colors">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Tenant Portal</p>
              <p className="text-sm text-muted-foreground">Resident Access</p>
            </div>
            <div className="w-full mt-1 rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm font-bold text-foreground text-center group-hover:border-muted-foreground/60 transition-colors">
              Tenant Login
            </div>
          </Link>
        </div>

        {/* Feature pills */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
          {[
            { icon: Brain, label: "Deep Thinking AI" },
            { icon: Zap, label: "Real-time Anomaly Detection" },
            { icon: TrendingUp, label: "Occupancy Forecasting" },
            { icon: Shield, label: "Jules 5-Layer Security" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-full border border-border bg-surface-raised px-4 py-2 text-sm text-muted-foreground"
            >
              <Icon className="h-3.5 w-3.5 text-brand" />
              {label}
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 px-6 py-4 flex items-center justify-between text-xs text-muted-foreground mt-auto">
        <span>IRent &copy; 2026</span>
        <span className="flex items-center gap-1.5">
          <Shield className="h-3 w-3" />
          Secured by Jules 5-Layer Security Model
        </span>
      </footer>
    </div>
  );
}
