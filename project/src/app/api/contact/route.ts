import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, address, serviceType, budgetRange, timeframe, referralSource, description } = body;

    if (!email || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert into MySQL contact_leads table
    const result = await query(
      `INSERT INTO contact_leads 
       (name, email, phone, address, service_type, budget_range, timeframe, referral_source, description, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', NOW())`,
      [name || null, email, phone || null, address || null, serviceType || null, budgetRange || null, timeframe || null, referralSource || null, description]
    );

    const insertId = (result as any).insertId;

    return NextResponse.json({ success: true, leadId: insertId }, { status: 200 });
  } catch (error) {
    console.error('Contact form API error:', error);
    return NextResponse.json(
      { error: 'Submission failed — please try again or call (864) 724-4600' },
      { status: 500 }
    );
  }
}
