# MySQL Migration Complete - Deployment Ready

## ✅ Completed Changes

### 1. Environment Configuration
- **Root `.env`**: Removed all Supabase keys; added MySQL connection vars
  - `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`, `PORT=3001`

### 2. Database Helper (MySQL)
- Created MySQL connection pool in:
  - `src/lib/mysql.ts`
  - `project/src/lib/mysql.ts`
- Provides `query()` and `queryOne()` helpers with parameterized queries

### 3. API Routes Converted (All use MySQL now)
#### Root App (`src/app/api/`)
- `/api/contact` - Create leads + portal users
- `/api/crm/leads` - List all leads  
- `/api/crm/leads/[id]` - Get/update specific lead
- `/api/crm/leads/[id]/notes` - Lead notes
- `/api/crm/leads/[id]/activities` - Lead activities
- `/api/crm/statistics` - CRM stats
- `/api/portal/login` - Portal authentication
- `/api/portal/documents` - Portal document listing

#### Project Folder (`project/src/app/api/`)
- `/api/contact`
- `/api/crm/leads`
- `/api/crm/leads/[id]`
- `/api/crm/leads/[id]/notes`
- `/api/crm/leads/[id]/activities`
- `/api/crm/statistics`
- `/api/admin/stats`
- `/api/admin/customers`

### 4. Package Dependencies
- Root `package.json`: `mysql2` added, no Supabase
- Project `package.json`: `mysql2` added, Supabase removed

### 5. New Pages Created
- `/admin` - CRM dashboard (lists leads, stats)
- `/services` - Services showcase
- `/portal` - Customer portal login & documents

## ⚠️ Known Remaining Supabase References

### Portal/Auth Components (Not Critical for Initial Deploy)
The following still reference Supabase Auth but are optional:
- `project/src/contexts/AuthContext.tsx` (Supabase Auth hooks)
- `project/src/app/portal/*` pages (use AuthContext)
- `project/src/lib/supabase.ts` (file exists but unused by main app)

**Recommendation**: These are customer portal auth features. For MVP, the contact form + CRM admin work without them.

## 🚀 Deployment Steps

### On Server (Ubuntu/Linux)

#### 1. Fix MySQL Service
```bash
# Install MySQL if missing
apt-get update
apt-get install -y mysql-server

# Start MySQL
systemctl restart mysql
systemctl status mysql

# Secure installation
mysql_secure_installation
```

#### 2. Create Database & User
```bash
mysql -u root -p <<'SQL'
CREATE DATABASE burch_contracting;
CREATE USER 'burch_user'@'localhost' IDENTIFIED BY 'YourStrongPassword123!';
GRANT ALL PRIVILEGES ON burch_contracting.* TO 'burch_user'@'localhost';
FLUSH PRIVILEGES;
SQL
```

#### 3. Apply Migrations
```bash
cd /root/burch-contracting

# CRM tables
mysql -h localhost -u burch_user -p burch_contracting < supabase/migrations/mysql_001_create_contact_leads.sql
mysql -h localhost -u burch_user -p burch_contracting < supabase/migrations/mysql_002_create_lead_notes.sql
mysql -h localhost -u burch_user -p burch_contracting < supabase/migrations/mysql_003_create_lead_activities.sql

# Portal tables
mysql -h localhost -u burch_user -p burch_contracting < supabase/migrations/mysql_004_create_portal_tables.sql
```

#### 4. Update Environment File
Create `/root/burch-contracting/.env.local`:
```bash
cat > /root/burch-contracting/.env.local <<'EOF'
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=burch_user
MYSQL_PASSWORD=YourStrongPassword123!
MYSQL_DATABASE=burch_contracting
PORT=3001
EOF
```

#### 5. Upload Latest Code
From your **Windows machine** (in the repo root):
```bash
# Upload source, migrations, and config
scp -r src root@srv1178278:/root/burch-contracting/src
scp -r supabase root@srv1178278:/root/burch-contracting/supabase
scp package.json root@srv1178278:/root/burch-contracting/package.json
scp .env.local root@srv1178278:/root/burch-contracting/.env.local
```

#### 6. Build & Restart
On the server:
```bash
cd /root/burch-contracting
npm install
npm run build
pm2 restart burch-contracting

# If PM2 app doesn't exist:
pm2 start npm --name burch-contracting -- start
pm2 save
```

#### 7. Verify Deployment
```bash
# Check app status
pm2 logs burch-contracting

# Test locally
curl http://localhost:3001

# Check public access
curl http://yourserver.com
```

### Nginx Configuration (Already Set Up)
Ensure Nginx is proxying port 80 → 3001:
```nginx
location / {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

Reload Nginx if changed:
```bash
nginx -t
systemctl reload nginx
```

### SSL (Already Configured)
Your SSL via Certbot is already active. Verify:
```bash
certbot certificates
systemctl status certbot.timer
```

## 🧪 Testing Checklist

1. **Home Page**: Visit `/` - should load with header links
2. **Services Page**: Visit `/services` - displays service cards
3. **Contact Form**: Submit at `/contact` - creates lead in MySQL
4. **Admin CRM**: Visit `/admin` - lists leads from `contact_leads`
5. **Portal Page**: Visit `/portal` - shows login form (functionality limited without full auth)

## 📋 Local Development

To preview changes locally before deploying:

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open `http://localhost:3000` in VS Code Simple Browser or browser.

## ❓ Troubleshooting

### MySQL Won't Start
- Check logs: `journalctl -u mysql -n 100 --no-pager`
- Check disk space: `df -h`
- Fix ownership: `chown -R mysql:mysql /var/lib/mysql`

### App Fails to Connect to MySQL
- Verify `.env.local` exists and has correct credentials
- Test connection: `mysql -h localhost -u burch_user -p burch_contracting -e "SELECT 1;"`

### Port 3001 in Use
- Check what's using it: `lsof -i :3001`
- Kill process: `kill -9 <PID>`
- Restart PM2: `pm2 restart burch-contracting`

### Build Errors
- Check Node version: `node -v` (should be 18+)
- Clear cache: `rm -rf .next node_modules && npm install && npm run build`

## 📦 What's Next

1. **Complete Portal Auth**: Replace Supabase Auth with custom JWT/session auth if customer portal is priority
2. **Add Customer Tables**: Migrate `customers`, `quotes`, `invoices`, `messages` schemas to MySQL
3. **Email Integration**: Connect contact form to email notifications
4. **Admin Login**: Secure `/admin` with authentication

---

**Status**: Ready for deployment once MySQL is running on server and migrations are applied.
