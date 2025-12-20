# Customer Portal Guide

## Overview
The customer portal allows your clients to view quotes, invoices, and communicate with your business in real-time.

## Accessing the Portal

### For Customers
1. Navigate to `/portal` on your website
2. Click "Sign up" to create a new account
3. Fill in your details (name, email, phone, password)
4. After signing up, you'll be automatically logged in

### Portal Features

#### Dashboard (`/portal`)
- View summary of active quotes, unpaid invoices, and unread messages
- Quick access to recent activity
- Statistics overview

#### Quotes (`/portal/quotes`)
- View all quotes sent to you
- Click on a quote to see detailed line items
- Accept quotes directly from the portal
- Quote statuses: draft, sent, viewed, accepted, rejected, expired

#### Invoices (`/portal/invoices`)
- View all invoices
- Track payment status
- See due dates and amounts
- Invoice statuses: draft, sent, viewed, paid, overdue, cancelled

#### Messages (`/portal/messages`)
- Send messages to the business
- Receive responses from staff
- View conversation history
- Messages are marked as read automatically when viewed

## Admin Tasks (Database Management)

### Creating Quotes for Customers

You'll need to manually insert quotes into the database. Here's an example:

```sql
-- First, create a customer (or they sign up)
INSERT INTO customers (name, email, phone, address)
VALUES ('John Doe', 'john@example.com', '555-123-4567', '123 Main St');

-- Create a quote
INSERT INTO quotes (customer_id, quote_number, title, description, status, total_amount, valid_until)
VALUES (
  '[customer_id from above]',
  'Q-2024-001',
  'Kitchen Remodel',
  'Complete kitchen renovation including cabinets, countertops, and appliances',
  'sent',
  15000.00,
  CURRENT_DATE + INTERVAL '30 days'
);

-- Add quote line items
INSERT INTO quote_items (quote_id, description, quantity, unit_price, total_price, sort_order)
VALUES
  ('[quote_id from above]', 'Custom Cabinets', 1, 8000.00, 8000.00, 1),
  ('[quote_id from above]', 'Granite Countertops', 1, 5000.00, 5000.00, 2),
  ('[quote_id from above]', 'Labor', 40, 50.00, 2000.00, 3);
```

### Creating Invoices

```sql
-- Create an invoice
INSERT INTO invoices (
  customer_id,
  invoice_number,
  title,
  description,
  status,
  subtotal,
  tax_rate,
  tax_amount,
  total_amount,
  due_date
)
VALUES (
  '[customer_id]',
  'INV-2024-001',
  'Kitchen Remodel - Deposit',
  '50% deposit for kitchen renovation project',
  'sent',
  7500.00,
  8.50,
  637.50,
  8137.50,
  CURRENT_DATE + INTERVAL '15 days'
);

-- Add invoice line items
INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total_price, sort_order)
VALUES
  ('[invoice_id]', 'Project Deposit (50%)', 1, 7500.00, 7500.00, 1);
```

### Sending Messages to Customers

```sql
-- Send a message from admin to customer
INSERT INTO messages (customer_id, sender_type, sender_name, subject, content)
VALUES (
  '[customer_id]',
  'admin',
  'Burch Contracting',
  'Your Quote is Ready',
  'Hi! We've prepared a detailed quote for your kitchen remodel project. Please review it and let us know if you have any questions.'
);
```

## Database Schema

### Customers Table
- Stores customer account information
- Linked to Supabase Auth users
- Can be linked to original contact form leads

### Quotes & Quote Items
- Quotes represent project estimates
- Quote items are line-by-line breakdowns
- Customers can accept quotes directly

### Invoices & Invoice Items
- Invoices for billing
- Track payment status and amounts paid
- Support partial payments

### Messages
- Two-way communication system
- Supports message threads
- Tracks read/unread status

## Row Level Security

All tables have RLS enabled. Customers can only see their own data:
- Customers see only their quotes, invoices, and messages
- Data is filtered by `customer_id` matching their auth `user_id`

## Next Steps

### Building an Admin Interface
Consider creating an admin panel at `/admin` or `/crm/admin` to:
- Create and manage quotes
- Generate invoices
- Send messages to customers
- View customer activity
- Convert leads to customers

### Email Notifications
Add email notifications when:
- A new quote is ready
- An invoice is due
- Payment is received
- A customer sends a message

### Payment Integration
Integrate with Stripe or another payment processor to:
- Allow customers to pay invoices online
- Track payment history
- Send payment receipts

## Troubleshooting

### Customer Can't See Their Data
- Verify the customer's `user_id` in the `customers` table matches their auth user ID
- Check that RLS policies are enabled
- Ensure the customer is logged in

### Environment Variables Not Working
Make sure these are set in your `.env` and Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Portal Not Showing in Navigation
The "Customer Portal" link is in the main navigation header. If you don't see it, check that the Header component is rendering correctly.
