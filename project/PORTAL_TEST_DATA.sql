-- Customer Portal Test Data
-- Run this SQL in your Supabase SQL Editor to create sample data for testing

-- NOTE: First, create a user account by signing up at /portal/signup
-- After signing up, find your user_id from the auth.users table:
-- SELECT id, email FROM auth.users;
-- Then replace 'YOUR_USER_ID_HERE' below with your actual user_id

-- Example customer (update this with your real user_id after signup)
-- INSERT INTO customers (user_id, name, email, phone, address)
-- VALUES (
--   'YOUR_USER_ID_HERE',
--   'Test Customer',
--   'test@example.com',
--   '555-123-4567',
--   '123 Test Street, Test City, TS 12345'
-- );

-- After creating a customer, get the customer_id:
-- SELECT id, name FROM customers;
-- Replace 'YOUR_CUSTOMER_ID_HERE' below with the actual customer_id

-- Sample Quote 1: Kitchen Remodel
DO $$
DECLARE
  v_customer_id uuid;
  v_quote_id uuid;
BEGIN
  -- Get the first customer (or specify your customer_id)
  SELECT id INTO v_customer_id FROM customers LIMIT 1;

  IF v_customer_id IS NOT NULL THEN
    -- Create quote
    INSERT INTO quotes (customer_id, quote_number, title, description, status, total_amount, valid_until, notes)
    VALUES (
      v_customer_id,
      'Q-2024-001',
      'Kitchen Remodel',
      'Complete kitchen renovation including custom cabinets, granite countertops, and premium appliances installation.',
      'sent',
      25750.00,
      CURRENT_DATE + INTERVAL '30 days',
      'Price includes all materials and labor. 50% deposit required to begin work.'
    )
    RETURNING id INTO v_quote_id;

    -- Add quote items
    INSERT INTO quote_items (quote_id, description, quantity, unit_price, total_price, sort_order)
    VALUES
      (v_quote_id, 'Custom Oak Cabinets (Upper & Lower)', 1, 12000.00, 12000.00, 1),
      (v_quote_id, 'Granite Countertops (Installed)', 1, 6500.00, 6500.00, 2),
      (v_quote_id, 'Sink & Faucet Installation', 1, 850.00, 850.00, 3),
      (v_quote_id, 'Backsplash Tile Work', 1, 1400.00, 1400.00, 4),
      (v_quote_id, 'Electrical Work', 16, 125.00, 2000.00, 5),
      (v_quote_id, 'Plumbing Updates', 12, 150.00, 1800.00, 6),
      (v_quote_id, 'Demolition & Disposal', 1, 1200.00, 1200.00, 7);

    RAISE NOTICE 'Created Quote Q-2024-001 for customer %', v_customer_id;
  ELSE
    RAISE NOTICE 'No customers found. Please create a customer first by signing up at /portal/signup';
  END IF;
END $$;

-- Sample Quote 2: Bathroom Renovation
DO $$
DECLARE
  v_customer_id uuid;
  v_quote_id uuid;
BEGIN
  SELECT id INTO v_customer_id FROM customers LIMIT 1;

  IF v_customer_id IS NOT NULL THEN
    INSERT INTO quotes (customer_id, quote_number, title, description, status, total_amount, valid_until)
    VALUES (
      v_customer_id,
      'Q-2024-002',
      'Master Bathroom Renovation',
      'Full bathroom remodel with walk-in shower, new vanity, and tile flooring.',
      'sent',
      14500.00,
      CURRENT_DATE + INTERVAL '45 days'
    )
    RETURNING id INTO v_quote_id;

    INSERT INTO quote_items (quote_id, description, quantity, unit_price, total_price, sort_order)
    VALUES
      (v_quote_id, 'Walk-in Shower Installation', 1, 4500.00, 4500.00, 1),
      (v_quote_id, 'Double Vanity with Granite Top', 1, 3200.00, 3200.00, 2),
      (v_quote_id, 'Tile Flooring (Porcelain)', 80, 45.00, 3600.00, 3),
      (v_quote_id, 'Lighting & Fixtures', 1, 1200.00, 1200.00, 4),
      (v_quote_id, 'Plumbing & Installation', 20, 100.00, 2000.00, 5);

    RAISE NOTICE 'Created Quote Q-2024-002 for customer %', v_customer_id;
  END IF;
END $$;

-- Sample Invoice 1: Kitchen Project Deposit
DO $$
DECLARE
  v_customer_id uuid;
  v_invoice_id uuid;
BEGIN
  SELECT id INTO v_customer_id FROM customers LIMIT 1;

  IF v_customer_id IS NOT NULL THEN
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
      amount_paid,
      due_date
    )
    VALUES (
      v_customer_id,
      'INV-2024-001',
      'Kitchen Remodel - Deposit',
      '50% deposit for kitchen renovation project as outlined in Quote Q-2024-001',
      'sent',
      12875.00,
      8.50,
      1094.38,
      13969.38,
      0.00,
      CURRENT_DATE + INTERVAL '15 days'
    )
    RETURNING id INTO v_invoice_id;

    INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total_price, sort_order)
    VALUES
      (v_invoice_id, 'Project Deposit (50%)', 1, 12875.00, 12875.00, 1);

    RAISE NOTICE 'Created Invoice INV-2024-001 for customer %', v_customer_id;
  END IF;
END $$;

-- Sample Invoice 2: Completed Work
DO $$
DECLARE
  v_customer_id uuid;
  v_invoice_id uuid;
BEGIN
  SELECT id INTO v_customer_id FROM customers LIMIT 1;

  IF v_customer_id IS NOT NULL THEN
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
      amount_paid,
      due_date,
      paid_date
    )
    VALUES (
      v_customer_id,
      'INV-2024-002',
      'Deck Repair - Final Payment',
      'Final payment for deck repair and staining project',
      'paid',
      2400.00,
      8.50,
      204.00,
      2604.00,
      2604.00,
      CURRENT_DATE - INTERVAL '5 days',
      CURRENT_DATE - INTERVAL '2 days'
    )
    RETURNING id INTO v_invoice_id;

    INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total_price, sort_order)
    VALUES
      (v_invoice_id, 'Deck Board Replacement', 24, 35.00, 840.00, 1),
      (v_invoice_id, 'Deck Staining & Sealing', 1, 800.00, 800.00, 2),
      (v_invoice_id, 'Labor', 15, 50.67, 760.00, 3);

    RAISE NOTICE 'Created Invoice INV-2024-002 for customer %', v_customer_id;
  END IF;
END $$;

-- Sample Messages
DO $$
DECLARE
  v_customer_id uuid;
  v_customer_name text;
BEGIN
  SELECT id, name INTO v_customer_id, v_customer_name FROM customers LIMIT 1;

  IF v_customer_id IS NOT NULL THEN
    -- Welcome message from admin
    INSERT INTO messages (customer_id, sender_type, sender_name, subject, content, created_at)
    VALUES (
      v_customer_id,
      'admin',
      'Burch Contracting',
      'Welcome to Your Customer Portal!',
      'Hi! Thank you for choosing Burch Contracting. This portal allows you to view your quotes, track invoices, and message us directly. We''ve prepared a quote for your kitchen remodel project - please take a look and let us know if you have any questions!',
      NOW() - INTERVAL '2 days'
    );

    -- Quote ready message
    INSERT INTO messages (customer_id, sender_type, sender_name, subject, content, is_read, created_at)
    VALUES (
      v_customer_id,
      'admin',
      'Burch Contracting',
      'Your Kitchen Remodel Quote is Ready',
      'We''ve completed the detailed quote for your kitchen renovation. The total comes to $25,750 which includes all materials and labor. The project timeline is estimated at 3-4 weeks. Please review and let us know if you''d like to proceed!',
      false,
      NOW() - INTERVAL '1 day'
    );

    -- Sample customer message
    INSERT INTO messages (customer_id, sender_type, sender_name, content, is_read, created_at)
    VALUES (
      v_customer_id,
      'customer',
      v_customer_name,
      'Thanks for the quote! I have a few questions about the timeline. Can we discuss the cabinet options in more detail? Also, what''s your earliest start date?',
      true,
      NOW() - INTERVAL '12 hours'
    );

    -- Admin response
    INSERT INTO messages (customer_id, sender_type, sender_name, content, is_read, created_at)
    VALUES (
      v_customer_id,
      'admin',
      'Burch Contracting',
      'Absolutely! I''d be happy to discuss the cabinet options. We have three different styles available - traditional raised panel, shaker style, and modern flat panel. Our earliest start date would be in about 2 weeks. Would you like to schedule a time to meet and go over the details?',
      false,
      NOW() - INTERVAL '6 hours'
    );

    RAISE NOTICE 'Created sample messages for customer %', v_customer_id;
  END IF;
END $$;

-- Verify the data was created
SELECT 'Customers:' as table_name, COUNT(*) as count FROM customers
UNION ALL
SELECT 'Quotes:', COUNT(*) FROM quotes
UNION ALL
SELECT 'Quote Items:', COUNT(*) FROM quote_items
UNION ALL
SELECT 'Invoices:', COUNT(*) FROM invoices
UNION ALL
SELECT 'Invoice Items:', COUNT(*) FROM invoice_items
UNION ALL
SELECT 'Messages:', COUNT(*) FROM messages;
