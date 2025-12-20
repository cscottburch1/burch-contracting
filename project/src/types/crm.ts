export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
export type LeadPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ActivityType = 'status_change' | 'note_added' | 'email_sent' | 'call_made' | 'meeting_scheduled' | 'proposal_sent';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  service_type?: string;
  budget_range?: string;
  timeframe?: string;
  referral_source?: string;
  description: string;
  status: LeadStatus;
  priority: LeadPriority;
  assigned_to?: string;
  estimated_value?: number;
  scheduled_date?: string;
  last_contact_date?: string;
  source_url?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  note_type: string;
  content: string;
  created_by?: string;
  created_at: string;
  is_important: boolean;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  activity_type: ActivityType;
  description: string;
  created_by?: string;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface LeadStatistics {
  status: LeadStatus;
  count: number;
  avg_value: number;
  total_value: number;
}

export interface Customer {
  id: string;
  user_id: string;
  lead_id?: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export type QuoteStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';

export interface Quote {
  id: string;
  customer_id: string;
  quote_number: string;
  title: string;
  description: string;
  status: QuoteStatus;
  total_amount: number;
  valid_until?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface QuoteItem {
  id: string;
  quote_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  sort_order: number;
}

export interface Invoice {
  id: string;
  customer_id: string;
  quote_id?: string;
  invoice_number: string;
  title: string;
  description: string;
  status: InvoiceStatus;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  amount_paid: number;
  due_date?: string;
  paid_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  sort_order: number;
}

export interface Message {
  id: string;
  customer_id: string;
  sender_type: 'customer' | 'admin';
  sender_name: string;
  subject?: string;
  content: string;
  is_read: boolean;
  parent_message_id?: string;
  created_at: string;
}
