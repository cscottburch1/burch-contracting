'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  service_type: string | null;
  budget_range: string | null;
  description: string;
  created_at: string;
}

export default function PortalDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/portal');
        return;
      }
      setUser(user);
      fetchLead(user.email!);
    };
    checkUser();
  }, [router]);

  const fetchLead = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('email', email.toLowerCase())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setLead(data);
    } catch {
      setError('No project found yet — we’ll update you soon!');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      new: 'bg-yellow-100 text-yellow-800',
      contacted: 'bg-blue-100 text-blue-800',
      quoted: 'bg-purple-100 text-purple-800',
      'in progress': 'bg-green-100 text-green-800',
      won: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
      lost: 'bg-gray-100 text-gray-800',
    };
    const key = status?.toLowerCase() || 'new';
    return map[key] || map.new;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-xl text-gray-600">Loading your project...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white py-10 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold">Your Project Portal</h1>
        <p className="mt-2 text-blue-100 text-lg">
          Hi {user?.user_metadata?.full_name || user?.email}
        </p>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* No Project */}
        {error && !lead && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-8 text-center">
            <p className="text-lg text-yellow-800 font-medium">{error}</p>
            <p className="mt-3 text-gray-600">We’ll email you as soon as your project is ready!</p>
          </div>
        )}

        {/* Main Dashboard */}
        {lead && (
          <>
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Current Status</h2>
              <div className={`inline-block px-8 py-4 rounded-full text-lg font-bold ${getStatusBadge(lead.status)}`}>
                {lead.status ? lead.status.charAt(0).toUpperCase() + lead.status.slice(1) : 'New'}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Project Details</h3>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Service:</strong> {lead.service_type || 'Not specified'}</p>
                  <p><strong>Budget Range:</strong> {lead.budget_range || 'TBD'}</p>
                  <p><strong>Submitted:</strong> {formatDate(lead.created_at)}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Your Request</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{lead.description}</p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-3">What Happens Next?</h3>
              <p className="text-lg">We’ll contact you within