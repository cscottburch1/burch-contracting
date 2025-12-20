'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Quote, QuoteItem } from '@/types/crm';
import Link from 'next/link';

export default function QuoteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, customer, loading: authLoading } = useAuth();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/portal/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (customer && params.id) {
      loadQuote();
    }
  }, [customer, params.id]);

  const loadQuote = async () => {
    if (!customer || !params.id) return;

    try {
      const [quoteRes, itemsRes] = await Promise.all([
        supabase
          .from('quotes')
          .select('*')
          .eq('id', params.id)
          .eq('customer_id', customer.id)
          .maybeSingle(),
        supabase
          .from('quote_items')
          .select('*')
          .eq('quote_id', params.id)
          .order('sort_order'),
      ]);

      if (quoteRes.error) throw quoteRes.error;
      if (quoteRes.data) {
        setQuote(quoteRes.data);
        if (quoteRes.data.status === 'sent') {
          await supabase
            .from('quotes')
            .update({ status: 'viewed' })
            .eq('id', params.id);
        }
      }

      if (itemsRes.data) setItems(itemsRes.data);
    } catch (error) {
      console.error('Error loading quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!quote) return;

    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status: 'accepted' })
        .eq('id', quote.id);

      if (error) throw error;
      setQuote({ ...quote, status: 'accepted' });
    } catch (error) {
      console.error('Error accepting quote:', error);
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
          <p className="text-gray-600">Loading quote...</p>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card padding="lg">
          <div className="text-center py-12">
            <Icon name="FileText" size={64} className="mx-auto mb-4 opacity-20 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Quote Not Found</h2>
            <p className="text-gray-600 mb-6">This quote doesn't exist or you don't have access to it.</p>
            <Link href="/portal/quotes">
              <Button variant="primary">Back to Quotes</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/portal/quotes" className="text-blue-600 hover:text-blue-700">
              <Icon name="ArrowLeft" size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Quote Details</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card padding="lg" className="mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{quote.quote_number}</h2>
                <Badge color={getStatusColor(quote.status)}>{quote.status}</Badge>
              </div>
              <p className="text-xl font-semibold text-gray-700 mb-2">{quote.title}</p>
              <p className="text-gray-600">{quote.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-500 mb-1">Created</p>
              <p className="font-semibold text-gray-900">
                {new Date(quote.created_at).toLocaleDateString()}
              </p>
            </div>
            {quote.valid_until && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Valid Until</p>
                <p className="font-semibold text-gray-900">
                  {new Date(quote.valid_until).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Items</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Qty</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Unit Price</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-gray-900">{item.description}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-gray-600">${item.unit_price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">
                        ${item.total_price.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between items-center py-3 border-t-2 border-gray-900">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  ${quote.total_amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {quote.notes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-gray-600">{quote.notes}</p>
            </div>
          )}

          {quote.status === 'sent' || quote.status === 'viewed' ? (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex gap-4">
                <Button variant="primary" size="lg" onClick={handleAccept}>
                  <Icon name="Check" size={20} />
                  Accept Quote
                </Button>
                <Button variant="outline" size="lg" href="/portal/messages">
                  <Icon name="Mail" size={20} />
                  Ask a Question
                </Button>
              </div>
            </div>
          ) : quote.status === 'accepted' ? (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <Icon name="Check" className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-green-900 mb-1">Quote Accepted</p>
                  <p className="text-green-700 text-sm">
                    Thank you for accepting this quote. We'll be in touch soon to schedule the work.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
