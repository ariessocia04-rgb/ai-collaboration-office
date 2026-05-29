'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [propertyName, setPropertyName] = useState('');
  const [address, setAddress] = useState('');
  const [rent, setRent] = useState(0);
  const [kwhRate, setKwhRate] = useState(0);
  const [waterRate, setWaterRate] = useState(0);
  const [dueDay, setDueDay] = useState(1);
  const router = useRouter();

  const handleComplete = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: property, error: pError } = await supabase
      .from('properties')
      .insert({ owner_id: user.id, name: propertyName, address })
      .select()
      .single();

    if (pError) {
      alert(pError.message);
      return;
    }

    const { error: policyError } = await supabase
      .from('property_policies')
      .insert({
        property_id: property.id,
        default_rent: rent,
        kwh_rate: kwhRate,
        water_rate: waterRate,
        due_day: dueDay,
      });

    if (policyError) {
      alert(policyError.message);
      return;
    }

    router.push('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Property Policy Wizard</h1>
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Step 1: Property Details</h2>
          <div>
            <label className="block text-sm font-medium">Property Name</label>
            <input type="text" className="mt-1 block w-full border rounded-md p-2" value={propertyName} onChange={e => setPropertyName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium">Address</label>
            <textarea className="mt-1 block w-full border rounded-md p-2" value={address} onChange={e => setAddress(e.target.value)} />
          </div>
          <button onClick={() => setStep(2)} className="bg-indigo-600 text-white px-4 py-2 rounded-md">Next</button>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Step 2: Default Rates</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium">Monthly Rent</label><input type="number" className="mt-1 block w-full border rounded-md p-2" value={rent} onChange={e => setRent(Number(e.target.value))} /></div>
            <div><label className="block text-sm font-medium">kWh Rate</label><input type="number" className="mt-1 block w-full border rounded-md p-2" value={kwhRate} onChange={e => setKwhRate(Number(e.target.value))} /></div>
            <div><label className="block text-sm font-medium">m³ Rate</label><input type="number" className="mt-1 block w-full border rounded-md p-2" value={waterRate} onChange={e => setWaterRate(Number(e.target.value))} /></div>
            <div><label className="block text-sm font-medium">Due Day</label><input type="number" min="1" max="31" className="mt-1 block w-full border rounded-md p-2" value={dueDay} onChange={e => setDueDay(Number(e.target.value))} /></div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setStep(1)} className="border px-4 py-2 rounded-md">Back</button>
            <button onClick={handleComplete} className="bg-indigo-600 text-white px-4 py-2 rounded-md">Complete</button>
          </div>
        </div>
      )}
    </div>
  );
}
