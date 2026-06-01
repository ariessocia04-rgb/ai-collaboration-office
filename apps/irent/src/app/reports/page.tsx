'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Report {
  id: string;
  tenant_id: string;
  room_id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  profiles?: { full_name: string; email: string };
  rooms?: { name: string };
}

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
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
          setLoading(false);
          return;
        }

        // Fetch rooms for those properties
        const { data: roomsData } = await supabase
          .from('rooms')
          .select('id')
          .in('property_id', propsData.map(p => p.id));

        if (!roomsData || roomsData.length === 0) {
          setLoading(false);
          return;
        }

        // Fetch reports for those rooms
        const { data: reportsData, error: err } = await supabase
          .from('reports')
          .select('*, profiles(full_name, email), rooms(name)')
          .in('room_id', roomsData.map(r => r.id))
          .order('created_at', { ascending: false });

        if (err) throw err;
        setReports(reportsData || []);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [router]);

  const handleStatusChange = async (reportId: string, status: string) => {
    try {
      const { error: err } = await supabase
        .from('reports')
        .update({ status })
        .eq('id', reportId);

      if (err) throw err;

      // Update local state
      setReports(reports.map(r => r.id === reportId ? { ...r, status } : r));
      setSelectedReport(null);
    } catch (error) {
      console.error('Error updating report status:', error);
    }
  };

  const filteredReports = reports.filter(report => {
    if (filterStatus === 'all') return true;
    return report.status === filterStatus;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Tenant Reports</h1>
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="all">All Reports</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReports.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <p className="text-gray-500 text-lg">No reports found</p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Room: {report.rooms?.name || 'N/A'}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      report.status === 'open'
                        ? 'bg-red-100 text-red-800'
                        : report.status === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {report.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{report.description}</p>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600">
                    <strong>Reported by:</strong> {report.profiles?.full_name || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> {report.profiles?.email || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(report.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{selectedReport.title}</h2>
              <p className="text-gray-700 mb-4">{selectedReport.description}</p>

              <div className="mb-6 space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Room:</strong> {selectedReport.rooms?.name || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Tenant:</strong> {selectedReport.profiles?.full_name || 'Unknown'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {selectedReport.profiles?.email || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Date:</strong> {new Date(selectedReport.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Status
                </label>
                <select
                  value={newStatus || selectedReport.status}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    handleStatusChange(selectedReport.id, newStatus || selectedReport.status);
                  }}
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Update
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
