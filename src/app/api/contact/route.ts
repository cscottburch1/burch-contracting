import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

const generateAccessCode = () => Math.random().toString(36).slice(2, 10).toUpperCase();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, phone, email, address, serviceType, budgetRange, timeframe, referralSource, description } = body;

    if (!name || !phone || !email || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO contact_leads (name, phone, email, address, service_type, budget_range, timeframe, referral_source, description, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')
    `;

    const results = await query(sql, [
      name,
      phone,
      email,
      address || null,
      serviceType || null,
      budgetRange || null,
      timeframe || null,
      referralSource || null,
      description
    ]);

    const leadId = (results as any).insertId;
    const accessCode = generateAccessCode();

    await query(
      'INSERT INTO portal_users (lead_id, email, access_code, status) VALUES (?, ?, ?, "active")',
      [leadId, email, accessCode]
    );

    return NextResponse.json(
      { success: true, data: { id: leadId, portalAccessCode: accessCode } },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
