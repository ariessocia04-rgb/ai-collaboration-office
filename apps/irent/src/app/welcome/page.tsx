'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const [tenancy, setTenancy] = useState<any>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchTenancy() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('tenancies').select('id, move_in, rooms(name, properties(name)), tenancy_terms(id, snapshot)').eq('tenant_id', user.id).single();
      if (data) setTenancy(data);
    }
    fetchTenancy();
  }, []);

  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !termsAccepted || !policyAccepted) return;
    await supabase.from('profiles').update({ terms_accepted_at: new Date().toISOString() }).eq('id', user.id);
    router.push('/dashboard');
  };

  if (!tenancy) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-8">
      <h1 className="text-3xl font-bold">Welcome!</h1>
      <section className="border p-4 rounded-md">
        <h2 className="text-xl font-semibold">Policy</h2>
        <pre>{JSON.stringify(tenancy.tenancy_terms[0]?.snapshot, null, 2)}</pre>
      </section>
      <div className="space-y-2">
        <label className="flex gap-2"><input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} /> Accept Terms</label>
        <label className="flex gap-2"><input type="checkbox" checked={policyAccepted} onChange={e => setPolicyAccepted(e.target.checked)} /> Accept Policy</label>
      </div>
      <button disabled={!termsAccepted || !policyAccepted} onClick={handleSubmit} className="w-full bg-indigo-600 text-white py-3 rounded-md disabled:opacity-50 font-bold">Enter Dashboard</button>
    </div>
  );
}
