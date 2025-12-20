'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import type { Quote } from '@/types/crm';
import Link from 'next/link';

export default function QuotesPage() {
  const router = useRouter();
  const { user, customer, loading: authLoading } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/portal/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (customer) {
      loadQuotes();
    }
  }, [customer]);

  const loadQuotes = async () => {
    if (!customer) return;

    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setQuotes(data);
    } catch (error) {
      console.error('Error loading quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'gray' | 'blue' | 'green' | 'red' | 'yellow'> = {
      draft: 'gray',
      sent: 'blue',
      viewed: 'blue',
      accepted: 'green',
      rejected: 'red',
      expired: 'gray',
    };
    return colors[status] || 'gray';
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quotes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/portal" className="text-blue-600 hover:text-blue-700">
              <Icon name="ArrowLeft" size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Quotes</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {quotes.length === 0 ? (
          <Card padding="lg">
            <div className="text-center py-12">
              <Icon name="FileText" size={64} className="mx-auto mb-4 opacity-20 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Quotes Yet</h2>
              <p className="text-gray-600">You don't have any quotes at the moment.</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {quotes.map((quote) => (
              <Link key={quote.id} href={`/portal/quotes/${quote.id}`}>
                <Card padding="lg" className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{quote.quote_number}</h3>
                        <Badge color={getStatusColor(quote.status)}>{quote.status}</Badge>
                      </div>
                      <p className="text-xl font-semibold text-gray-800 mb-2">{quote.title}</p>
                      <p className="text-gray-600 mb-4 line-clamp-2">{quote.description}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Icon name="Calendar" size={16} />
                          Created: {new Date(quote.created_at).toLocaleDateString()}
                        </span>
                        {quote.valid_until && (
                          <span className="flex items-center gap-1">
                            <Icon name="Clock" size={16} />
                            Valid until: {new Date(quote.valid_until).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm text-gray-500 mb-1">Total</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${quote.total_amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
