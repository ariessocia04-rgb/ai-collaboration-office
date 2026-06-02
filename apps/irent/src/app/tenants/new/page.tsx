'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { IRentLogo } from "@/components/irent-logo";
import {
  Mail,
  User,
  Building2,
  DollarSign,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  Send,
  Shield,
  Info,
  Hash,
} from "lucide-react";
import Link from "next/link";

export default function NewTenantPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [roomId, setRoomId] = useState('');
  const [moveIn, setMoveIn] = useState('');
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<'details' | 'sent'>('details');
  const router = useRouter();

  useEffect(() => {
    async function fetchRooms() {
      const { data } = await supabase.from('rooms').select('id, name');
      if (data) setRooms(data);
    }
    fetchRooms();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/invite-tenant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          email,
          fullName,
          roomId,
          moveIn,
        }),
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setStep('sent');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between bg-card">
        <IRentLogo />
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="h-5 w-5 text-brand" />
            <h1 className="text-2xl font-bold text-foreground">Tenant Invitation</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Send a secure, AI-verified invitation link to a prospective tenant.
          </p>
        </div>

        {step === 'details' ? (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <form onSubmit={handleInvite} className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                    <User className="h-3.5 w-3.5" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full rounded-lg border border-border px-4 py-2.5 text-sm bg-surface-sunken text-foreground outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                    <Mail className="h-3.5 w-3.5" /> Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-border px-4 py-2.5 text-sm bg-surface-sunken text-foreground outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                    <Building2 className="h-3.5 w-3.5" /> Room
                  </label>
                  <select
                    required
                    value={roomId}
                    onChange={e => setRoomId(e.target.value)}
                    className="w-full rounded-lg border border-border px-4 py-2.5 text-sm bg-surface-sunken text-foreground outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  >
                    <option value="">Select a room</option>
                    {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                    <Calendar className="h-3.5 w-3.5" /> Move-in Date
                  </label>
                  <input
                    type="date"
                    required
                    value={moveIn}
                    onChange={e => setMoveIn(e.target.value)}
                    className="w-full rounded-lg border border-border px-4 py-2.5 text-sm bg-surface-sunken text-foreground outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-brand/20 bg-brand/5 p-4">
                <Shield className="h-4 w-4 text-brand mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Secured with Jules 5-Layer Security. The tenant will verify their identity before accepting.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-bold text-primary-foreground hover:bg-brand-glow disabled:opacity-50"
              >
                {loading ? 'Sending...' : <><Send className="h-4 w-4" /> Send Invitation</>}
              </button>
              {message && <p className="text-center text-red-500 text-xs">{message}</p>}
            </form>
          </div>
        ) : (
          <div className="rounded-xl border border-brand/30 bg-brand/5 p-10 text-center space-y-5">
            <div className="flex justify-center">
              <CheckCircle2 className="h-20 w-20 text-brand" />
            </div>
            <h2 className="text-2xl font-bold">Invitation Sent</h2>
            <p className="text-muted-foreground">A secure link has been sent to {email}.</p>
            <Link
              href="/dashboard"
              className="inline-block rounded-lg bg-brand px-8 py-3 text-sm font-bold text-primary-foreground hover:bg-brand-glow"
            >
              Back to Dashboard
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
