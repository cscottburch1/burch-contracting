import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET(request: NextRequest) {
  try {
    const [totalLeads] = await query<{count: number}>('SELECT COUNT(*) as count FROM contact_leads');
    const [totalCustomers] = await query<{count: number}>('SELECT COUNT(*) as count FROM customers');
    const [totalQuotes] = await query<{count: number}>('SELECT COUNT(*) as count FROM quotes');
    const [totalInvoices] = await query<{count: number}>('SELECT COUNT(*) as count FROM invoices');
    const [pendingQuotes] = await query<{count: number}>("SELECT COUNT(*) as count FROM quotes WHERE status = 'pending'");
    const [unpaidInvoices] = await query<{count: number}>("SELECT COUNT(*) as count FROM invoices WHERE status IN ('sent', 'overdue')");
    const [unreadMessages] = await query<{count: number}>("SELECT COUNT(*) as count FROM messages WHERE is_read = FALSE AND sender_type = 'customer'");

    return NextResponse.json({
      totalLeads: totalLeads?.count || 0,
      totalCustomers: totalCustomers?.count || 0,
      totalQuotes: totalQuotes?.count || 0,
      totalInvoices: totalInvoices?.count || 0,
      pendingQuotes: pendingQuotes?.count || 0,
      unpaidInvoices: unpaidInvoices?.count || 0,
      unreadMessages: unreadMessages?.count || 0,
      recentActivity: 0,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
