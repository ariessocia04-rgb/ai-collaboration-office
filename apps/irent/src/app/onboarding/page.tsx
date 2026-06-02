'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Step 1 — property details
  const [propertyName, setPropertyName] = useState('');
  const [address, setAddress] = useState('');

  // Step 2 — rates & billing
  const [defaultRent, setDefaultRent] = useState('');
  const [kwhRate, setKwhRate] = useState('');
  const [waterRate, setWaterRate] = useState('');
  const [dueDay, setDueDay] = useState('5');

  // Step 3 — advance & deposit (from the plan's tenancy_terms snapshot)
  const [requireAdvance, setRequireAdvance] = useState(false);
  const [advanceMonths, setAdvanceMonths] = useState('1');
  const [requireDeposit, setRequireDeposit] = useState(false);
  const [depositMonths, setDepositMonths] = useState('1');

  // Live move-in total preview (deep reasoning: show owner exactly what tenant pays on day 1)
  const moveInTotal = (() => {
    const rent = parseFloat(defaultRent) || 0;
    const advance = requireAdvance ? parseFloat(advanceMonths) * rent : 0;
    const deposit = requireDeposit ? parseFloat(depositMonths) * rent : 0;
    return rent + advance + deposit;
  })();

  // Guard: redirect if already onboarded
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      const { data } = await supabase.from('properties').select('id').eq('owner_id', user.id).limit(1);
      if (data && data.length > 0) router.push('/dashboard');
    })();
  }, [router]);

  const handleComplete = async () => {
    setSaving(true);
    setError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (!propertyName.trim() || !address.trim()) throw new Error('Property name and address are required');
      if (!defaultRent || parseFloat(defaultRent) <= 0) throw new Error('Default rent must be greater than 0');

      // Insert property
      const { data: property, error: pErr } = await supabase
        .from('properties')
        .insert({ owner_id: user.id, name: propertyName.trim(), address: address.trim() })
        .select()
        .single();
      if (pErr) throw pErr;

      // Insert property_policies with advance/deposit config (immutable snapshot per plan)
      const { error: polErr } = await supabase
        .from('property_policies')
        .insert({
          property_id: property.id,
          default_rent: parseFloat(defaultRent),
          kwh_rate: parseFloat(kwhRate) || 0,
          water_rate: parseFloat(waterRate) || 0,
          due_day: parseInt(dueDay) || 5,
          require_advance: requireAdvance,
          advance_months: requireAdvance ? parseInt(advanceMonths) : 0,
          require_deposit: requireDeposit,
          deposit_months: requireDeposit ? parseInt(depositMonths) : 0,
        });
      if (polErr) throw polErr;

      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        {/* Progress */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Setup</h1>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map(n => (
              <div
                key={n}
                className={`flex-1 h-2 rounded-full ${step >= n ? 'bg-indigo-600' : 'bg-gray-200'}`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Step {step} of 3 — {['Property Details', 'Billing Rates', 'Move-in Terms'][step - 1]}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-8 space-y-6">

          {/* Step 1 */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Dela Cruz Boarding House"
                  value={propertyName}
                  onChange={e => setPropertyName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  placeholder="e.g., 123 Rizal St, Quezon City, Metro Manila"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
              </div>
              <button
                disabled={!propertyName.trim() || !address.trim()}
                onClick={() => setStep(2)}
                className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                Next →
              </button>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent (₱)</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border border-gray-300 rounded-md p-3"
                    placeholder="3500"
                    value={defaultRent}
                    onChange={e => setDefaultRent(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bill Due Day</label>
                  <input
                    type="number"
                    min="1"
                    max="28"
                    className="w-full border border-gray-300 rounded-md p-3"
                    value={dueDay}
                    onChange={e => setDueDay(e.target.value)}
                  />
                  <p className="text-xs text-gray-400 mt-1">Day of month bills are due</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Electricity Rate (₱/kWh)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-300 rounded-md p-3"
                    placeholder="11.50"
                    value={kwhRate}
                    onChange={e => setKwhRate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Water Rate (₱/m³)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-300 rounded-md p-3"
                    placeholder="25.00"
                    value={waterRate}
                    onChange={e => setWaterRate(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <button onClick={() => setStep(1)} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-50">
                  ← Back
                </button>
                <button
                  disabled={!defaultRent || parseFloat(defaultRent) <= 0}
                  onClick={() => setStep(3)}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            </>
          )}

          {/* Step 3 — Move-in terms with live preview */}
          {step === 3 && (
            <>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-indigo-600"
                      checked={requireAdvance}
                      onChange={e => setRequireAdvance(e.target.checked)}
                    />
                    <span className="font-medium text-gray-800">Require Advance Payment</span>
                  </label>
                  {requireAdvance && (
                    <div className="mt-3 ml-7">
                      <label className="text-sm text-gray-600">How many months advance?</label>
                      <select
                        className="mt-1 block w-32 border border-gray-300 rounded-md p-2"
                        value={advanceMonths}
                        onChange={e => setAdvanceMonths(e.target.value)}
                      >
                        {[1, 2, 3].map(n => <option key={n} value={n}>{n} month{n > 1 ? 's' : ''}</option>)}
                      </select>
                    </div>
                  )}
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-indigo-600"
                      checked={requireDeposit}
                      onChange={e => setRequireDeposit(e.target.checked)}
                    />
                    <span className="font-medium text-gray-800">Require Security Deposit</span>
                  </label>
                  {requireDeposit && (
                    <div className="mt-3 ml-7">
                      <label className="text-sm text-gray-600">How many months deposit?</label>
                      <select
                        className="mt-1 block w-32 border border-gray-300 rounded-md p-2"
                        value={depositMonths}
                        onChange={e => setDepositMonths(e.target.value)}
                      >
                        {[1, 2, 3].map(n => <option key={n} value={n}>{n} month{n > 1 ? 's' : ''}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Live move-in total preview */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-5">
                <p className="text-sm font-semibold text-indigo-700 mb-3">Move-in Total Preview</p>
                <div className="space-y-1 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>First month rent</span>
                    <span>₱{parseFloat(defaultRent || '0').toLocaleString()}</span>
                  </div>
                  {requireAdvance && (
                    <div className="flex justify-between">
                      <span>Advance ({advanceMonths} month{parseInt(advanceMonths) > 1 ? 's' : ''})</span>
                      <span>₱{(parseFloat(advanceMonths) * parseFloat(defaultRent || '0')).toLocaleString()}</span>
                    </div>
                  )}
                  {requireDeposit && (
                    <div className="flex justify-between">
                      <span>Deposit ({depositMonths} month{parseInt(depositMonths) > 1 ? 's' : ''})</span>
                      <span>₱{(parseFloat(depositMonths) * parseFloat(defaultRent || '0')).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-indigo-300 pt-2 mt-2 flex justify-between font-bold text-indigo-800">
                    <span>Total due on move-in</span>
                    <span>₱{moveInTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button onClick={() => setStep(2)} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-50">
                  ← Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={saving}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Finish Setup ✓'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
