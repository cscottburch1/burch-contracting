# MySQL Migration Status

## ✅ Completed Steps

### 1. Database Setup
- **Server:** ssh root@156.67.71.222
- **MySQL Host:** localhost
- **MySQL Port:** 3306
- **MySQL User:** u239178742_cscottburch
- **MySQL Database:** burch_contracting
- **Status:** SQL files uploaded to phpMyAdmin ✓

### 2. Configuration Files Updated
- ✅ `.env` - Updated with new MySQL credentials
- ✅ `.env.example` - Updated with MYSQL_* variable names
- ✅ `src/lib/mysql.ts` - Standardized to use MYSQL_* environment variables
- ✅ `project/src/lib/mysql.ts` - Already using MYSQL_* variables

### 3. File Structure
- ✅ SQL files organized in `project/MySQL/` folder:
  - `20251130171218_create_contact_leads_table.sql`
  - `20251130172658_add_crm_tables.sql`
  - `mysql_001_create_contact_leads.sql`
  - `mysql_002_create_lead_notes.sql`
  - `mysql_003_create_lead_activities.sql`
  - `mysql_004_create_portal_tables.sql`

## ⚠️ Pending Actions Required

### 4. Authentication System
The following files still reference Supabase Auth and need to be updated:

**Files using Supabase Auth:**
1. `project/src/lib/supabase.ts` - Supabase client (should be removed/replaced)
2. `project/src/contexts/AuthContext.tsx` - Uses Supabase Auth
3. `project/src/app/portal/page.tsx` - Uses Supabase Auth
4. `project/src/app/portal/quotes/page.tsx` - Uses Supabase Auth
5. `project/src/app/portal/quotes/[id]/page.tsx` - Uses Supabase Auth
6. `project/src/app/portal/messages/page.tsx` - Uses Supabase Auth
7. `project/src/app/portal/invoices/page.tsx` - Uses Supabase Auth

**Options for Authentication:**
- **Option A:** Implement custom JWT-based authentication with MySQL
- **Option B:** Use NextAuth.js with MySQL adapter
- **Option C:** Implement session-based authentication with express-session
- **Option D:** Keep Supabase Auth but use MySQL for data storage

### 5. Package Dependencies
Current dependencies:
```json
{
  "mysql2": "^3.6.5",
  "next": "^14.2.0",
  "react": "^18.3.1"
}
```

**If keeping Supabase Auth:**
- Install: `npm install @supabase/supabase-js`

**If migrating to NextAuth.js:**
- Install: `npm install next-auth @next-auth/mysql2-adapter`

## 📝 Environment Variables Summary

### Production (.env)
```bash
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=u239178742_cscottburch
MYSQL_PASSWORD=Breana3397@@
MYSQL_DATABASE=burch_contracting
PORT=3001
```

### For Supabase Auth (if keeping)
You would need to add:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🔧 Next Steps

1. **Decide on Authentication Strategy** - Choose one of the options above
2. **Update Portal Pages** - Refactor the 6 portal pages to use your chosen auth method
3. **Test Database Connection** - Run the application and verify MySQL connectivity
4. **Remove/Update Supabase References** - Clean up based on your auth decision
5. **Update API Routes** - Ensure all API routes use the updated mysql.ts client

## 📊 Database Tables (from SQL files)

Based on your SQL files, you should have:
- `contact_leads` - Contact form submissions
- `lead_notes` - Notes for leads
- `lead_activities` - Activity tracking for leads
- `customers` - Customer portal users
- `quotes` - Customer quotes
- `invoices` - Customer invoices
- `messages` - Customer messaging system
- `projects` - Customer projects

## 🚀 Testing Commands

```bash
# Test MySQL connection from your server
ssh root@156.67.71.222
mysql -u u239178742_cscottburch -p burch_contracting

# Start the Next.js development server
npm run dev

# Build for production
npm run build
npm start
```

## 📌 Important Notes

- **Security:** Never commit the `.env` file with real credentials
- **Backup:** Always backup your database before making schema changes
- **Server Access:** SSH credentials provided - keep secure
- **Port:** Application runs on port 3001
