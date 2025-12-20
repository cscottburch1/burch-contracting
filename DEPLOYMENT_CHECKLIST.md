# Deployment Checklist for Customer Portal

## ❌ ISSUE: Portal Pages Show 404

Your portal pages are building successfully locally but showing 404 on the live site because **they haven't been deployed to Vercel yet**.

## ✅ Files That Need to Be Deployed

### New Portal Pages Created:
```
src/app/portal/
├── page.tsx                    (Dashboard)
├── login/page.tsx             (Login page)
├── signup/page.tsx            (Signup page)
├── quotes/
│   ├── page.tsx              (Quotes list)
│   └── [id]/page.tsx         (Quote detail)
├── invoices/page.tsx         (Invoices list)
└── messages/page.tsx         (Messages)
```

### Supporting Files Created/Modified:
```
src/contexts/AuthContext.tsx    (Authentication logic)
src/lib/supabase.ts            (Supabase client)
src/types/crm.ts               (Type definitions updated)
src/components/ui/Badge.tsx    (Updated with new variants)
src/components/ui/Icon.tsx     (Added new icons)
src/components/layout/Header.tsx (Added Customer Portal link)
src/app/layout.tsx             (Added AuthProvider)
```

### Database Migration Created:
```
supabase/migrations/20251202164925_create_customer_portal_tables.sql
```

### Documentation Created:
```
CUSTOMER_PORTAL_GUIDE.md       (User guide)
PORTAL_TEST_DATA.sql          (Sample data for testing)
DEPLOYMENT_CHECKLIST.md       (This file)
```

## 🚀 How to Deploy

### Option 1: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Option 2: Using Git (if connected to GitHub)
```bash
# Add all changes
git add .

# Commit changes
git commit -m "Add customer portal with quotes, invoices, and messaging"

# Push to GitHub
git push origin main
```

Vercel will automatically detect the push and deploy.

### Option 3: Manual Deployment via Vercel Dashboard
1. Go to your Vercel dashboard
2. Click on your project
3. Click "Deployments"
4. Click "Redeploy" button
5. Or connect to GitHub and it will auto-deploy on push

## ⚠️ Important: Environment Variables

Make sure these are set in Vercel (already done from earlier):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## ✅ Verify Deployment

After deploying, test these URLs:
- `https://yoursite.com/portal` - Should show dashboard or redirect to login
- `https://yoursite.com/portal/login` - Should show login form
- `https://yoursite.com/portal/signup` - Should show signup form

## 📊 Database Setup (Already Complete)

The database tables are already created in Supabase:
- ✅ customers
- ✅ quotes & quote_items
- ✅ invoices & invoice_items
- ✅ messages

## 🧪 Testing After Deployment

1. Go to `yoursite.com/portal/signup`
2. Create a test account
3. Login at `yoursite.com/portal/login`
4. Run the SQL from `PORTAL_TEST_DATA.sql` in Supabase to create sample data
5. Explore the portal features

## 🔍 Current Build Status

```bash
npm run build
```

Shows these portal routes are building correctly:
- ○ /portal
- ○ /portal/invoices
- ○ /portal/login
- ○ /portal/messages
- ○ /portal/quotes
- ƒ /portal/quotes/[id]
- ○ /portal/signup

All routes build successfully with no errors!

## 🐛 Troubleshooting

### If portal pages still show 404 after deployment:

1. **Check build logs in Vercel**
   - Make sure all pages compiled successfully
   - Look for any errors during build

2. **Verify files are in repository**
   - Check that `src/app/portal/` folder exists in your repo
   - Ensure all page.tsx files are committed

3. **Clear Vercel cache**
   - In Vercel dashboard, go to Settings > General
   - Scroll down and click "Clear Build Cache & Redeploy"

4. **Check Next.js config**
   - Ensure `next.config.js` doesn't have any route excludes

## 📝 Next Steps After Deployment

1. **Create your first customer account**
   - Visit `/portal/signup`
   - Fill in the form

2. **Add sample data**
   - Open Supabase SQL Editor
   - Run `PORTAL_TEST_DATA.sql`

3. **Test the portal**
   - Login and explore features
   - Send test messages
   - View sample quotes and invoices

4. **Build admin interface** (future enhancement)
   - Create quotes for customers
   - Generate invoices
   - Respond to customer messages
   - Track customer activity

## 🎯 Summary

The customer portal is **fully built and working locally**. You just need to **deploy it to Vercel** for it to work on your live site.

The simplest way is to run:
```bash
vercel --prod
```

Or push your code to GitHub if your Vercel project is connected to a repo.
