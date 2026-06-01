'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

type Room = {
  id: string;
  name: string;
};

export default function NewTenantPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [roomId, setRoomId] = useState('');
  const [moveIn, setMoveIn] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
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

      if (!session?.access_token) {
        throw new Error('You must be signed in to invite a tenant.');
      }

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

      const result = await response.json() as { error?: string };

      if (result.error) {
        throw new Error(result.error);
      }

      setMessage('Invitation sent successfully!');
      setTimeout(() => router.push('/tenants'), 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to send invitation.';
      setMessage(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Invite New Tenant</h1>
      <form onSubmit={handleInvite} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 border rounded"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <select
          className="w-full p-2 border rounded"
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
          required
        >
          <option value="">Select a room</option>
          {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={moveIn}
          onChange={e => setMoveIn(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Invitation'}
        </button>
        {message && <p className="text-center mt-4 text-sm font-medium">{message}</p>}
      </form>
    </div>
  );
}
