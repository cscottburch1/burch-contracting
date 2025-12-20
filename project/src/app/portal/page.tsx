'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import type { Quote, Invoice, Message } from '@/types/crm';
import Link from 'next/link';

export default function PortalPage() {
  const router = useRouter();
  const { user, customer, loading: authLoading, signOut } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/portal/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (customer) {
      loadData();
    }
  }, [customer]);

  const loadData = async () => {
    if (!customer) return;

    try {
      const [quotesRes, invoicesRes, messagesRes] = await Promise.all([
        supabase
          .from('quotes')
          .select('*')
          .eq('customer_id', customer.id)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('invoices')
          .select('*')
          .eq('customer_id', customer.id)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('messages')
          .select('*')
          .eq('customer_id', customer.id)
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      if (quotesRes.data) setQuotes(quotesRes.data);
      if (invoicesRes.data) setInvoices(invoicesRes.data);
      if (messagesRes.data) setMessages(messagesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const getQuoteStatusColor = (status: string) => {
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

  const getInvoiceStatusColor = (status: string) => {
    const colors: Record<string, 'gray' | 'blue' | 'green' | 'red' | 'yellow'> = {
      draft: 'gray',
      sent: 'blue',
      viewed: 'blue',
      paid: 'green',
      overdue: 'red',
      cancelled: 'gray',
    };
    return colors[status] || 'gray';
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  const unreadMessages = messages.filter(m => !m.is_read && m.sender_type === 'admin').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-blue-600 hover:text-blue-700">
                <Icon name="Home" size={24} />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Customer Portal</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Welcome, {customer.name}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <Icon name="LogOut" size={16} />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Quotes</p>
                <p className="text-3xl font-bold text-gray-900">{quotes.filter(q => !['rejected', 'expired', 'accepted'].includes(q.status)).length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Icon name="FileText" className="text-blue-600" size={24} />
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Unpaid Invoices</p>
                <p className="text-3xl font-bold text-gray-900">{invoices.filter(i => i.status !== 'paid').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Icon name="DollarSign" className="text-green-600" size={24} />
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Unread Messages</p>
                <p className="text-3xl font-bold text-gray-900">{unreadMessages}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Icon name="Mail" className="text-yellow-600" size={24} />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Quotes</h2>
              <Link href="/portal/quotes" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                View All
              </Link>
            </div>
            <Card padding="none">
              {quotes.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Icon name="FileText" size={48} className="mx-auto mb-3 opacity-20" />
                  <p>No quotes yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {quotes.map((quote) => (
                    <Link
                      key={quote.id}
                      href={`/portal/quotes/${quote.id}`}
                      className="block p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">{quote.quote_number}</span>
                        <Badge color={getQuoteStatusColor(quote.status)}>{quote.status}</Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{quote.title}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          {new Date(quote.created_at).toLocaleDateString()}
                        </span>
                        <span className="font-semibold text-gray-900">
                          ${quote.total_amount.toLocaleString()}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Invoices</h2>
              <Link href="/portal/invoices" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                View All
              </Link>
            </div>
            <Card padding="none">
              {invoices.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Icon name="DollarSign" size={48} className="mx-auto mb-3 opacity-20" />
                  <p>No invoices yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <Link
                      key={invoice.id}
                      href={`/portal/invoices/${invoice.id}`}
                      className="block p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">{invoice.invoice_number}</span>
                        <Badge color={getInvoiceStatusColor(invoice.status)}>{invoice.status}</Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{invoice.title}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          Due: {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A'}
                        </span>
                        <span className="font-semibold text-gray-900">
                          ${invoice.total_amount.toLocaleString()}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Messages</h2>
            <Link href="/portal/messages" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
              View All
            </Link>
          </div>
          <Card padding="none">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Icon name="Mail" size={48} className="mx-auto mb-3 opacity-20" />
                <p>No messages yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {messages.map((message) => (
                  <Link
                    key={message.id}
                    href={`/portal/messages`}
                    className={`block p-4 hover:bg-gray-50 transition-colors ${
                      !message.is_read && message.sender_type === 'admin' ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{message.sender_name}</span>
                        {!message.is_read && message.sender_type === 'admin' && (
                          <Badge color="blue">New</Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(message.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {message.subject && (
                      <p className="font-medium text-gray-700 mb-1">{message.subject}</p>
                    )}
                    <p className="text-gray-600 text-sm line-clamp-2">{message.content}</p>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
