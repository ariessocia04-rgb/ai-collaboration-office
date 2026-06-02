'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    occupancy: 85,
    pendingBills: 4,
    urgentReports: 2,
    monthlyRevenue: 125000,
  });

  const [insights, setInsights] = useState([
    {
      type: 'Utility Warning',
      message: 'Room 302 has used 40% more electricity than their 6-month average. Possible appliance leak or unauthorized heater.',
      reasoning: 'Common sense: Sudden spikes in usage without seasonal changes often indicate equipment failure or policy violation.'
    },
    {
      type: 'Occupancy Prediction',
      message: 'Expected 100% occupancy next month.',
      reasoning: 'Deep thinking: Based on 3 pending move-in invitations and current low vacancy rate in the area.'
    },
    {
      type: 'Maintenance Priority',
      message: 'Replace AC filter in Room 105.',
      reasoning: 'Preventive logic: Last maintenance was 5 months ago; replacing now prevents 3x higher repair costs in summer peak.'
    }
  ]);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-end border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold">Owner Dashboard</h1>
          <p className="text-zinc-500">Intelligent property management</p>
        </div>
        <div className="text-right">
          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">Jules AI: Deep Thinking Active</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Occupancy" value={`${stats.occupancy}%`} trend="+5% vs last month" />
        <StatCard title="Pending Bills" value={stats.pendingBills} trend="Due in 3 days" color="text-amber-600" />
        <StatCard title="Urgent Reports" value={stats.urgentReports} trend="Needs attention" color="text-red-600" />
        <StatCard title="Monthly Revenue" value={`₱${stats.monthlyRevenue.toLocaleString()}`} trend="+12% YoY" />
      </div>

      {/* Deep Learning Insights Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span>🧠</span> Common Sense Insights
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {insights.map((insight, i) => (
            <div key={i} className="border-l-4 border-indigo-600 bg-white p-6 shadow-sm rounded-r-lg space-y-2">
              <div className="flex justify-between">
                <h3 className="font-bold text-indigo-900">{insight.type}</h3>
                <span className="text-xs font-mono text-zinc-400">REASONING ENGINE V1</span>
              </div>
              <p className="text-lg">{insight.message}</p>
              <p className="text-sm text-zinc-500 italic bg-zinc-50 p-2 rounded">
                <strong>Logic:</strong> {insight.reasoning}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Placeholder for Data Tables */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="border p-6 rounded-xl bg-zinc-50 h-64 flex items-center justify-center text-zinc-400 italic">
          Recent Transactions Chart (Placeholder)
        </div>
        <div className="border p-6 rounded-xl bg-zinc-50 h-64 flex items-center justify-center text-zinc-400 italic">
          Maintenance Reports Queue (Placeholder)
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, trend, color = "text-black" }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <p className="text-sm text-zinc-500 font-medium">{title}</p>
      <p className={`text-2xl font-bold ${color} my-1`}>{value}</p>
      <p className="text-xs text-zinc-400">{trend}</p>
    </div>
  );
}
