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

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      setLead(data);
    } catch (err: any) {
      setError('No project found yet — we’ll update you soon!');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'new': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'quoted': return 'bg-purple-100 text-purple-800';
      case 'won': case 'in progress': return 'bg-green-100 text-green-800';
      case 'lost': case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading your project...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold">Welcome to Your Project Portal</h1>
          <p className="mt-2 text-blue-100">Hi {user?.user_metadata?.full_name || user?.email}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {error && !lead ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <p className="text-lg text-yellow-800">{error}</p>
            <p className="mt-4 text-gray-600">
              We’ll send you an email as soon as your project is ready!
            </p>
          </div>
        ) : lead ? (
          <div class endoclass="space-y-8">
            {/* Status */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Project Status</h2>
              <div className={`inline-block px-6 py-3 rounded-full text-lg font-semibold ${getStatusColor(lead.status)}`}>
                {lead.status ? lead.status.charAt(0).toUpperCase() + lead.status.slice(1) : 'New'}
              </div>
            </div>

            {/* Details */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold mb-4">Project Details</h3>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Service:</strong> {lead.service_type || 'Not specified'}</p>
                  <p><strong>Budget Range:</strong> {lead.budget_range || 'TBD'}</p>
                  <p><strong>Submitted:</strong> {formatDate(lead.created_at)}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold mb-4">Your Description</h3>
                <p className="text-gray-700 leading-relaxed">{lead.description}</p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">What Happens Next?</h3>
              <p className="text-lg">We’ll contact you within 24 hours to schedule a free consultation.</p>
            </div>
          </div>
        ) : null}

        <div className="mt-12 text-center">
          <button
            onClick={() => supabase.auth.signOut().then(() => router.push('/portal'))}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}