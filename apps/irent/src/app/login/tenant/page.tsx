'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function TenantLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Tenant Login</h2>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <input type="email" required className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" required className="w-full p-2 border rounded" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">Sign in</button>
        </form>
      </div>
    </div>
  );
}
