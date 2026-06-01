'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface Property {
  id: string;
  name: string;
  address: string;
}

export default function NewRoomPage() {
  const router = useRouter();
  const [roomName, setRoomName] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data, error: err } = await supabase
          .from('properties')
          .select('id, name, address')
          .eq('owner_id', user.id);

        if (err) throw err;
        setProperties(data || []);
        if (data && data.length > 0) {
          setPropertyId(data[0].id);
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (!roomName.trim()) {
        setError('Room name is required');
        setSubmitting(false);
        return;
      }

      const { error: err } = await supabase
        .from('rooms')
        .insert({
          property_id: propertyId,
          name: roomName,
        });

      if (err) throw err;

      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error creating room:', err);
      setError(err.message || 'Failed to create room');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Add New Room</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Property
            </label>
            <select
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="">Choose a property...</option>
              {properties.map((prop) => (
                <option key={prop.id} value={prop.id}>
                  {prop.name} - {prop.address}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Name
            </label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g., Room 101"
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {submitting ? 'Creating...' : 'Create Room'}
          </button>
        </form>
      </div>
    </div>
  );
}
