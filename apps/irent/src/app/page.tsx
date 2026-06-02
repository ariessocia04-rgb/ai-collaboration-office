'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <header className="border-b border-slate-700/50 backdrop-blur-sm">
        <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            IRent
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="px-6 py-2 text-slate-300 hover:text-slate-50 font-medium transition-colors">
              Sign In
            </Link>
            <Link href="/login" className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        <div className="space-y-12">
          {/* Hero Content */}
          <div className="text-center space-y-6">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm font-medium">
                <span className="w-2 h-2 bg-cyan-400 rounded-full" />
                Manage properties efficiently
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-50 leading-tight">
              Property Management Made <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Simple</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Manage rental properties, track tenants, automate billing, and streamline operations all in one intuitive platform.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link
                href="/dashboard"
                className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-cyan-600/30"
              >
                Launch Dashboard
              </Link>
              <Link
                href="#features"
                className="px-8 py-3 border border-slate-600 text-slate-300 hover:border-slate-500 hover:text-slate-50 font-medium rounded-lg transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Feature Grid */}
          <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            {/* Feature 1: Room Management */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-50 mb-2">Room Management</h3>
              <p className="text-slate-400">
                Organize and manage all your rental units. Track room details, status, and pricing with ease.
              </p>
            </div>

            {/* Feature 2: Tenant Management */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 8.048M12 9v.75m6.923.023A9.002 9.002 0 0112.75 15H9m6.923-9.023A9.001 9.001 0 0112.75 9h3.75M15 12.794V6.375a3 3 0 00-3-3h-.375" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-50 mb-2">Tenant Lifecycle</h3>
              <p className="text-slate-400">
                Add, edit, and remove tenants instantly. Track lease dates and maintain complete tenant records.
              </p>
            </div>

            {/* Feature 3: Billing & Analytics */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-50 mb-2">Real-time Analytics</h3>
              <p className="text-slate-400">
                Monitor occupancy rates, revenue tracking, and property insights on a single dashboard.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 p-12 rounded-2xl bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 text-center space-y-4">
            <h2 className="text-3xl font-bold text-slate-50">Ready to streamline your property management?</h2>
            <p className="text-slate-400 text-lg">
              Join property managers who trust IRent for efficient rental operations.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-cyan-600/30"
            >
              Start Managing Today
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 text-center text-slate-400 text-sm">
          <p>&copy; 2026 IRent. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
