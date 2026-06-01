'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { analyzeMeterPhoto } from '@/lib/ai/gemini';
import { useRouter } from 'next/navigation';

interface Room {
  id: string;
  name: string;
  property_id: string;
}

interface Tenancy {
  id: string;
  room_id: string;
  tenant_id: string;
  status: string;
}

export default function MeterReadingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [meterType, setMeterType] = useState('electricity');
  const [reading, setReading] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        // Fetch properties owned by user
        const { data: propsData } = await supabase
          .from('properties')
          .select('id')
          .eq('owner_id', user.id);

        if (!propsData || propsData.length === 0) {
          setError('No properties found');
          setLoading(false);
          return;
        }

        // Fetch rooms for those properties
        const { data: roomsData, error: err } = await supabase
          .from('rooms')
          .select('*')
          .in('property_id', propsData.map(p => p.id));

        if (err) throw err;
        setRooms(roomsData || []);
        if (roomsData && roomsData.length > 0) {
          setSelectedRoom(roomsData[0].id);
        }
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError('Failed to load rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [router]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeImage = async () => {
    if (!imageFile) {
      setError('Please select an image first');
      return;
    }

    setAnalyzing(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        const result = await analyzeMeterPhoto(base64);
        
        // Extract the numeric value from the result
        const numberMatch = result.match(/\d+\.?\d*/);
        if (numberMatch) {
          setReading(numberMatch[0]);
        } else {
          setError('Could not extract meter reading from image. Please enter manually.');
        }
      };
      reader.readAsDataURL(imageFile);
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError('Failed to analyze image. Please enter reading manually.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (!selectedRoom || !reading) {
        setError('Please select a room and enter a reading');
        setSubmitting(false);
        return;
      }

      // Get active tenancy for the room
      const { data: tenancyData, error: tenancyErr } = await supabase
        .from('tenancies')
        .select('id')
        .eq('room_id', selectedRoom)
        .eq('status', 'active')
        .single();

      if (tenancyErr || !tenancyData) {
        setError('No active tenancy found for this room');
        setSubmitting(false);
        return;
      }

      // Insert meter reading
      const { error: err } = await supabase
        .from('meter_readings')
        .insert({
          tenancy_id: tenancyData.id,
          meter_type: meterType,
          reading: parseFloat(reading),
          reading_date: new Date().toISOString(),
        });

      if (err) throw err;

      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error creating meter reading:', err);
      setError(err.message || 'Failed to save meter reading');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Record Meter Reading</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Room Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Room
            </label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="">Choose a room...</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          {/* Meter Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meter Type
            </label>
            <select
              value={meterType}
              onChange={(e) => setMeterType(e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="electricity">Electricity (kWh)</option>
              <option value="water">Water (m³)</option>
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Meter Photo (Optional - for OCR)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            {imagePreview && (
              <div className="mt-4">
                <img src={imagePreview} alt="Meter" className="max-w-xs h-auto rounded-md" />
                <button
                  type="button"
                  onClick={handleAnalyzeImage}
                  disabled={analyzing}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {analyzing ? 'Analyzing...' : 'Analyze with AI'}
                </button>
              </div>
            )}
          </div>

          {/* Manual Reading Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meter Reading
            </label>
            <input
              type="number"
              step="0.01"
              value={reading}
              onChange={(e) => setReading(e.target.value)}
              placeholder="Enter meter reading"
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {submitting ? 'Saving...' : 'Save Meter Reading'}
          </button>
        </form>
      </div>
    </div>
  );
}
