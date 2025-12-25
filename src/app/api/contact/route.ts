import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { sendLeadEmail } from '@/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      company, // honeypot
      name,
      email,
      phone,
      address,
      serviceType,
      budgetRange,
      timeframe,
      referralSource,
      description,
    } = body;

    // Honeypot: bots fill this; humans don't
    if (company) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (!email || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1) Insert lead into MySQL
    const result: any = await query(
      `INSERT INTO contact_leads
       (name, email, phone, address, service_type, budget_range, timeframe, referral_source, description, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', NOW())`,
      [
        name || null,
        email,
        phone || null,
        address || null,
        serviceType || null,
        budgetRange || null,
        timeframe || null,
        referralSource || null,
        description,
      ]
    );

    const leadId = result?.insertId ?? null;

    // 2) Email your team (best-effort)
    const to = process.env.CONTACT_TO || 'estimates@burchcontracting.com';
    const subject = `New Lead${leadId ? ` #${leadId}` : ''} — ${serviceType || 'Website Contact'}`;

    const adminText =
`New lead received:

Name: ${name || '(not provided)'}
Email: ${email}
Phone: ${phone || '(not provided)'}
Address: ${address || '(not provided)'}
Service Type: ${serviceType || '(not provided)'}
Budget Range: ${budgetRange || '(not provided)'}
Timeframe: ${timeframe || '(not provided)'}
Referral Source: ${referralSource || '(not provided)'}

Description:
${description}

Lead ID: ${leadId ?? '(unknown)'}
`;

    try {
      await sendLeadEmail({ to, subject, text: adminText, replyTo: email });
    } catch (mailErr) {
      console.error('Lead email send failed:', mailErr);
    }

    // 3) Customer auto-reply (best-effort; controlled by env)
    const autoReplyEnabled = (process.env.AUTO_REPLY_ENABLED ?? 'true').toLowerCase() === 'true';
    if (autoReplyEnabled) {
      const customerSubject =
        process.env.AUTO_REPLY_SUBJECT || 'We received your request — Burch Contracting';

      const customerText =
`Hi${name ? ` ${name}` : ''},

Thanks for reaching out to Burch Contracting — we received your request and will follow up shortly.

If you need immediate help, call (864) 724-4600.

— Burch Contracting
`;

      // If you want the auto-reply to come “from” a different sender name/address,
      // use SMTP_FROM in .env.local. (Nodemailer uses SMTP_FROM already.)
      // AUTO_REPLY_FROM is kept here for future enhancement; most SMTP providers require SMTP_FROM anyway.
      try {
        await sendLeadEmail({ to: email, subject: customerSubject, text: customerText });
      } catch (mailErr) {
        console.error('Customer auto-reply failed:', mailErr);
      }
    }

    return NextResponse.json({ success: true, leadId }, { status: 200 });
  } catch (error) {
    console.error('Contact form API error:', error);
    return NextResponse.json(
      { error: 'Submission failed — please try again or call (864) 724-4600' },
      { status: 500 }
    );
  }
}
