'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface TenantInfo {
  id: string;
  email: string;
  full_name: string;
}

interface Room {
  id: string;
  name: string;
  property?: { name: string };
}

interface Bill {
  id: string;
  month: string;
  rent: number;
  electricity: number;
  water: number;
  total: number;
  status: string;
  due_date: string;
}

interface Report {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

export default function TenantPortalPage() {
  const router = useRouter();
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportTitle, setReportTitle] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login/tenant');
          return;
        }

        // Fetch tenant profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setTenant({
          id: user.id,
          email: user.email || '',
          full_name: profileData?.full_name || 'Tenant',
        });

        // Fetch active tenancy
        const { data: tenancyData } = await supabase
          .from('tenancies')
          .select('id, room_id')
          .eq('tenant_id', user.id)
          .eq('status', 'active')
          .single();

        if (!tenancyData) {
          setError('No active tenancy found');
          setLoading(false);
          return;
        }

        // Fetch room details
        const { data: roomData } = await supabase
          .from('rooms')
          .select('id, name, property_id')
          .eq('id', tenancyData.room_id)
          .single();

        setRoom(roomData);

        // Fetch bills
        const { data: billsData } = await supabase
          .from('bills')
          .select('*')
          .eq('tenancy_id', tenancyData.id)
          .order('due_date', { ascending: false });

        setBills(billsData || []);

        // Fetch reports
        const { data: reportsData } = await supabase
          .from('reports')
          .select('*')
          .eq('tenant_id', user.id)
          .order('created_at', { ascending: false });

        setReports(reportsData || []);
      } catch (err) {
        console.error('Error fetching tenant data:', err);
        setError('Failed to load tenant data');
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, [router]);

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReport(true);
    setError('');

    try {
      if (!reportTitle.trim() || !reportDescription.trim()) {
        setError('Please fill in all fields');
        setSubmittingReport(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Not authenticated');
        setSubmittingReport(false);
        return;
      }

      const { error: err } = await supabase
        .from('reports')
        .insert({
          tenant_id: user.id,
          room_id: room?.id,
          title: reportTitle,
          description: reportDescription,
          status: 'open',
        });

      if (err) throw err;

      setReportTitle('');
      setReportDescription('');

      // Refresh reports
      const { data: reportsData } = await supabase
        .from('reports')
        .select('*')
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false });

      setReports(reportsData || []);
    } catch (err: any) {
      console.error('Error submitting report:', err);
      setError(err.message || 'Failed to submit report');
    } finally {
      setSubmittingReport(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tenant Portal</h1>
            <p className="text-gray-600 mt-1">Welcome, {tenant?.full_name}</p>
          </div>
          <button
            onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}

        {/* Room Information */}
        {room && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Room</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Room</p>
                <p className="text-lg font-medium text-gray-900">{room.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Property</p>
                <p className="text-lg font-medium text-gray-900">{room.property?.name || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Bills Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Your Bills</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Electricity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Water</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bills.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No bills available
                    </td>
                  </tr>
                ) : (
                  bills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bill.month}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${bill.rent.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${bill.electricity.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${bill.water.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${bill.total.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(bill.due_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            bill.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {bill.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reports Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submit Report Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">File a Report</h2>
            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Title
                </label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="e.g., Broken window"
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Describe the issue..."
                  rows={4}
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submittingReport}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
              >
                {submittingReport ? 'Submitting...' : 'Submit Report'}
              </button>
            </form>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Reports</h2>
            <div className="space-y-4">
              {reports.length === 0 ? (
                <p className="text-gray-500">No reports filed yet</p>
              ) : (
                reports.map((report) => (
                  <div key={report.id} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{report.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          report.status === 'resolved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {report.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(report.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
