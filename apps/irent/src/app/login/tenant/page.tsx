'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TenantLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError('Login failed. Please try again.');
      setLoading(false);
      return;
    }

    // Deep thinking: check if they've accepted terms yet
    const { data: profile } = await supabase
      .from('profiles')
      .select('terms_accepted_at')
      .eq('id', data.user.id)
      .single();

    if (!profile?.terms_accepted_at) {
      router.push('/welcome');
    } else {
      router.push('/tenant-portal');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Tenant Login</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in with the credentials your owner sent you</p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="text-center">
          <Link href="/login" className="text-sm text-indigo-600 hover:underline">
            ← Owner login
          </Link>
        </div>
      </div>
    </div>
  );
}
