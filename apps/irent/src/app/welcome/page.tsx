'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

type TenancyTermSnapshot = {
  default_rent: number;
  kwh_rate: number;
  water_rate: number;
  due_day: number;
  require_advance: boolean;
  advance_months: number;
  require_deposit: boolean;
  deposit_months: number;
  property_name: string;
  room_name: string;
  move_in_total: number;
};

type TenancyWithTerms = {
  id: string;
  tenancy_terms: Array<{ id: string; snapshot: TenancyTermSnapshot }>;
  rooms: { name: string; properties: { name: string } | null } | null;
};

export default function WelcomePage() {
  const router = useRouter();
  const [tenancy, setTenancy] = useState<TenancyWithTerms | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login/tenant'); return; }

      // Deep thinking: check if already accepted — skip if so
      const { data: profile } = await supabase
        .from('profiles')
        .select('terms_accepted_at')
        .eq('id', user.id)
        .single();

      if (profile?.terms_accepted_at) {
        router.push('/tenant-portal');
        return;
      }

      const { data } = await supabase
        .from('tenancies')
        .select('id, tenancy_terms(id, snapshot), rooms(name, properties(name))')
        .eq('tenant_id', user.id)
        .eq('status', 'active')
        .single();

      if (data) setTenancy(data as unknown as TenancyWithTerms);
      setLoading(false);
    })();
  }, [router]);

  const handleAccept = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !tenancy) return;

    const termId = tenancy.tenancy_terms[0]?.id;

    // Write to terms_acceptances table (as per plan)
    if (termId) {
      await supabase.from('terms_acceptances').insert({
        tenancy_term_id: termId,
        tenant_id: user.id,
        accepted_at: new Date().toISOString(),
      });
    }

    // Also stamp profiles for middleware quick-check
    await supabase
      .from('profiles')
      .update({ terms_accepted_at: new Date().toISOString() })
      .eq('id', user.id);

    router.push('/tenant-portal');
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  if (!tenancy) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No active tenancy found</h1>
          <p className="text-gray-500">Please contact your owner to be invited.</p>
        </div>
      </div>
    );
  }

  const snapshot = tenancy.tenancy_terms[0]?.snapshot;
  const roomName = tenancy.rooms?.name ?? 'Your Room';
  const propertyName = tenancy.rooms?.properties?.name ?? 'Your Property';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <div className="text-5xl mb-4">🏠</div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to {propertyName}!</h1>
          <p className="text-gray-500 mt-2">Room: <strong>{roomName}</strong></p>
          <p className="text-gray-500 text-sm mt-1">Please review and accept your terms before entering your dashboard.</p>
        </div>

        {snapshot && (
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Your Tenancy Terms</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Monthly Rent</p>
                <p className="font-semibold text-gray-900">₱{snapshot.default_rent?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Bill Due Day</p>
                <p className="font-semibold text-gray-900">Every {snapshot.due_day}{['st','nd','rd'][snapshot.due_day-1] || 'th'} of the month</p>
              </div>
              <div>
                <p className="text-gray-500">Electricity Rate</p>
                <p className="font-semibold text-gray-900">₱{snapshot.kwh_rate}/kWh</p>
              </div>
              <div>
                <p className="text-gray-500">Water Rate</p>
                <p className="font-semibold text-gray-900">₱{snapshot.water_rate}/m³</p>
              </div>
              {snapshot.require_advance && (
                <div>
                  <p className="text-gray-500">Advance</p>
                  <p className="font-semibold text-gray-900">{snapshot.advance_months} month(s)</p>
                </div>
              )}
              {snapshot.require_deposit && (
                <div>
                  <p className="text-gray-500">Deposit</p>
                  <p className="font-semibold text-gray-900">{snapshot.deposit_months} month(s)</p>
                </div>
              )}
            </div>
            {snapshot.move_in_total > 0 && (
              <div className="bg-indigo-50 rounded-lg p-4 mt-2">
                <div className="flex justify-between font-bold text-indigo-800">
                  <span>Move-in Total Due</span>
                  <span>₱{snapshot.move_in_total?.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Acceptance</h2>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 w-4 h-4 accent-indigo-600"
              checked={termsAccepted}
              onChange={e => setTermsAccepted(e.target.checked)}
            />
            <span className="text-sm text-gray-700">
              I accept the <strong>Terms of Stay</strong> — I understand the billing schedule, rates, and payment obligations.
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 w-4 h-4 accent-indigo-600"
              checked={policyAccepted}
              onChange={e => setPolicyAccepted(e.target.checked)}
            />
            <span className="text-sm text-gray-700">
              I accept the <strong>Room & House Policy</strong> — I agree to follow house rules and take care of the property.
            </span>
          </label>
        </div>

        <button
          disabled={!termsAccepted || !policyAccepted || saving}
          onClick={handleAccept}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Enter Dashboard →'}
        </button>
      </div>
    </div>
  );
}
