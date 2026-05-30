'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function NewTenantPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [roomId, setRoomId] = useState('');
  const [moveIn, setMoveIn] = useState('');
  const [rooms, setRooms] = useState<any[]>([]);
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
    alert('Tenant invite logic would trigger here (Edge Function required for admin invite).');
    router.push('/tenants');
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Invite New Tenant</h1>
      <form onSubmit={handleInvite} className="space-y-4">
        <input type="text" placeholder="Full Name" className="w-full p-2 border rounded" value={fullName} onChange={e => setFullName(e.target.value)} />
        <input type="email" placeholder="Email" className="w-full p-2 border rounded" value={email} onChange={e => setEmail(e.target.value)} />
        <select className="w-full p-2 border rounded" value={roomId} onChange={e => setRoomId(e.target.value)}>
          <option value="">Select a room</option>
          {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <input type="date" className="w-full p-2 border rounded" value={moveIn} onChange={e => setMoveIn(e.target.value)} />
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">Send Invitation</button>
      </form>
    </div>
  );
}
