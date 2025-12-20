# MySQL Setup for Ubuntu/Linux Server (No cPanel)

## Prerequisites

Make sure MySQL Server is installed on your Ubuntu server:

```bash
# Check if MySQL is installed
mysql --version

# If not installed, install it:
sudo apt update
sudo apt install mysql-server -y

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql

# Verify it's running
sudo systemctl status mysql
```

---

## Step 1: Connect to MySQL

Connect to MySQL as root user:

```bash
# Method 1: If you have root password
sudo mysql -u root -p

# Method 2: If no password is set (default on Ubuntu)
sudo mysql -u root
```

You should see the MySQL prompt:
```
mysql>
```

---

## Step 2: Create Database and User

Run these commands in MySQL:

```sql
-- Create the database
CREATE DATABASE burch_contracting CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create a user for your app
CREATE USER 'burch_user'@'localhost' IDENTIFIED BY 'YourSecurePassword123!';

-- Grant all privileges to the user
GRANT ALL PRIVILEGES ON burch_contracting.* TO 'burch_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

**Important:** Replace `'YourSecurePassword123!'` with a strong password of your choice.

---

## Step 3: Run Migration Scripts

You have two options:

### Option A: Create SQL file and execute it

```bash
# Navigate to your project directory
cd /path/to/your/burch-contracting

# Run all three migration scripts in order
sudo mysql -u burch_user -p burch_contracting < supabase/migrations/mysql_001_create_contact_leads.sql
sudo mysql -u burch_user -p burch_contracting < supabase/migrations/mysql_002_create_lead_notes.sql
sudo mysql -u burch_user -p burch_contracting < supabase/migrations/mysql_003_create_lead_activities.sql
```

When prompted, enter the password you created above.

### Option B: Run directly in MySQL interactive mode

```bash
# Connect to MySQL
sudo mysql -u burch_user -p burch_contracting

# Copy and paste the SQL content from each migration file:
# 1. From mysql_001_create_contact_leads.sql
# 2. From mysql_002_create_lead_notes.sql
# 3. From mysql_003_create_lead_activities.sql

EXIT;
```

---

## Step 4: Verify Database Setup

```bash
# Connect to MySQL
sudo mysql -u burch_user -p burch_contracting

# Check if tables were created
SHOW TABLES;

# You should see:
# | Tables_in_burch_contracting |
# | contact_leads               |
# | lead_activities             |
# | lead_notes                  |

# Check table structure
DESCRIBE contact_leads;

EXIT;
```

---

## Step 5: Find Your Database Host

For a local Linux server:

```bash
# Check your server's IP address
hostname -I

# Your DB_HOST will be one of:
# - localhost (if app runs on same server)
# - 127.0.0.1 (localhost IP)
# - Your server's IP address (if app is remote)
```

If your Node.js app runs on the **same server**:
```
DB_HOST=localhost
```

If your Node.js app runs on a **different server**, use your server's IP:
```
DB_HOST=your.server.ip.address
```

---

## Step 6: Configure Your App

Create `.env.local` in your project root:

```bash
# Navigate to project
cd /path/to/your/burch-contracting

# Create .env.local file
nano .env.local
```

Add these lines:
```env
DB_HOST=localhost
DB_USER=burch_user
DB_PASSWORD=YourSecurePassword123!
DB_NAME=burch_contracting
NODE_ENV=production
```

Save and exit (Ctrl+X, then Y, then Enter in nano)

---

## Step 7: Install Node.js Dependencies

```bash
# Navigate to project
cd /path/to/your/burch-contracting

# Install dependencies
npm install

# Test build
npm run build
```

---

## Step 8: Start Your Application

### Option A: Direct Start (for testing)

```bash
npm start
```

Your app will run on http://localhost:3000

### Option B: Use PM2 (for production - keeps app running)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start your app with PM2
pm2 start npm --name "burch-contracting" -- start

# Make PM2 start on boot
pm2 startup
pm2 save

# Check status
pm2 status
```

---

## Step 9: Set Up Reverse Proxy (Optional but Recommended)

If you want to serve on port 80/443, use Nginx:

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx config
sudo nano /etc/nginx/sites-available/default
```

Replace content with:
```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

Now your app will be accessible on port 80 (HTTP).

---

## Step 10: Set Up SSL/HTTPS (Recommended)

Use Let's Encrypt with Certbot:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate (replace example.com with your domain)
sudo certbot --nginx -d example.com -d www.example.com

# Auto-renewal is set up automatically
```

---

## Troubleshooting

### "Access denied for user 'burch_user'@'localhost'"
- Check your password in `.env.local` matches what you set
- Verify user was created: `sudo mysql -u root -p -e "SELECT user FROM mysql.user;"`

### "Unknown database 'burch_contracting'"
- Verify database exists: `sudo mysql -u root -p -e "SHOW DATABASES;"`
- Run migration scripts again

### "Can't connect to MySQL server"
- Check MySQL is running: `sudo systemctl status mysql`
- Start it: `sudo systemctl start mysql`

### "npm: command not found"
- Install Node.js:
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt install nodejs -y
  ```

### Tables not created after running migration
- Check if scripts ran without errors:
  ```bash
  sudo mysql -u burch_user -p burch_contracting < supabase/migrations/mysql_001_create_contact_leads.sql
  ```
- Verify: `sudo mysql -u burch_user -p burch_contracting -e "SHOW TABLES;"`

---

## Complete Setup Checklist

- [ ] MySQL Server installed and running
- [ ] Database `burch_contracting` created
- [ ] User `burch_user` created with password
- [ ] Migration scripts executed (3 files)
- [ ] Tables verified with `SHOW TABLES;`
- [ ] `.env.local` configured with credentials
- [ ] `npm install` completed
- [ ] `npm run build` successful
- [ ] `npm start` runs without errors
- [ ] Can access http://localhost:3000
- [ ] Contact form works
- [ ] Admin dashboard accessible at /admin

---

## Quick Reference Commands

```bash
# Connect to MySQL
sudo mysql -u burch_user -p burch_contracting

# List all databases
SHOW DATABASES;

# Select database
USE burch_contracting;

# Show all tables
SHOW TABLES;

# Check table structure
DESCRIBE contact_leads;

# Count leads
SELECT COUNT(*) FROM contact_leads;

# Exit MySQL
EXIT;
```

---

## Next: Update Your Business Info

Once everything is working, edit `src/config/business.ts` with your:
- Company name
- Phone number
- Email
- Services
- Testimonials
- Projects

Then rebuild:
```bash
npm run build
pm2 restart burch-contracting
```

---

Your Linux server is now ready to run the Burch Contracting website with MySQL! 🚀
