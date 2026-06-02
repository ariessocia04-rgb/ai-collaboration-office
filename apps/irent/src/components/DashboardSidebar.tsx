'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: '📊' },
    { label: 'Rooms', href: '/dashboard/rooms', icon: '🏢' },
    { label: 'Tenants', href: '/dashboard/tenants', icon: '👤' },
    { label: 'Billing', href: '/dashboard/billing', icon: '💰' },
    { label: 'Reports', href: '/dashboard/reports', icon: '📈' },
  ];

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700/50 text-slate-50 p-6 min-h-screen flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">IRent</h1>
        <p className="text-sm text-slate-400 mt-1">Property Management</p>
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive(item.href)
                ? 'bg-cyan-600/20 border border-cyan-500/30 text-cyan-300'
                : 'text-slate-400 hover:text-slate-50 hover:bg-slate-700/50'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="pt-6 border-t border-slate-700/50">
        <div className="px-4 py-3 bg-slate-700/30 rounded-lg text-center">
          <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Version</p>
          <p className="text-sm text-slate-300 mt-1">1.0.0</p>
        </div>
      </div>
    </aside>
  );
}
