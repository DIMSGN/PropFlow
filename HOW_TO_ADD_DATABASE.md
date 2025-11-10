# 🗄️ How to Add MySQL Database to Render - Step-by-Step

## Quick Visual Guide

---

## Step 1: Go to Render Dashboard

1. Open your browser
2. Go to: **https://dashboard.render.com**
3. Log in with your account

---

## Step 2: Create New Database

1. Click the **"New +"** button (top right)
2. From the dropdown menu, select **"MySQL"**

```
┌─────────────────────────────┐
│  Dashboard      [New +]  ▼ │
│                             │
│  Dropdown appears:          │
│  ┌─────────────────────┐   │
│  │ Web Service         │   │
│  │ Static Site         │   │
│  │ Private Service     │   │
│  │ Background Worker   │   │
│  │ Cron Job           │   │
│  │ PostgreSQL         │   │
│  │ ▶ MySQL ◀          │ ← Click this!
│  │ Redis              │   │
│  └─────────────────────┘   │
└─────────────────────────────┘
```

---

## Step 3: Configure Database Settings

Fill in the form with these values:

### Basic Settings

| Field | Value | Notes |
|-------|-------|-------|
| **Name** | `propflow-db` | Any name you want (lowercase, no spaces) |
| **Database** | `propflow` | This is the actual database name |
| **User** | *(auto-generated)* | Leave blank - Render creates this |
| **Region** | `Frankfurt` or `Oregon` | Choose closest to you |
| **MySQL Version** | `8.0` | Keep default |

### Plan Selection

- Select **"Free"** plan
- Storage: 1 GB (included)
- No credit card required

```
┌─────────────────────────────────────────┐
│ Create MySQL Database                   │
├─────────────────────────────────────────┤
│                                         │
│ Name: [propflow-db____________]        │
│                                         │
│ Database: [propflow____________]       │
│                                         │
│ User: [________________] (auto-fill)   │
│                                         │
│ Region: [Frankfurt ▼]                  │
│                                         │
│ MySQL Version: [8.0 ▼]                 │
│                                         │
│ Plan:                                   │
│ ○ Starter - $7/month                   │
│ ● Free - $0/month  ← Select this!      │
│                                         │
│        [Create Database]                │
└─────────────────────────────────────────┘
```

---

## Step 4: Click "Create Database"

1. Click the blue **"Create Database"** button
2. Wait 2-3 minutes while Render provisions the database
3. You'll see a progress indicator

```
Creating database...
⏳ Provisioning MySQL instance
⏳ Setting up storage
⏳ Configuring network
✅ Database ready!
```

---

## Step 5: Get Database Credentials

Once created, you'll see the database dashboard with connection info:

### Connection Information

```
┌─────────────────────────────────────────────────────┐
│ propflow-db                                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Status: ● Available                                │
│                                                     │
│ INTERNAL DATABASE URL:                             │
│ mysql://user:pass@dpg-xxx.frankfurt.render.com/db │
│                                                     │
│ EXTERNAL DATABASE URL:                             │
│ mysql://user:pass@dpg-xxx-ext.frankfurt.render... │
│                                                     │
│ Connection Details:                                │
│ ┌─────────────────────────────────────────────┐  │
│ │ Host: dpg-xxxxx.frankfurt.render.com        │  │
│ │ Port: 3306                                  │  │
│ │ Database: propflow                          │  │
│ │ Username: propflow_user                     │  │
│ │ Password: xxxxx...xxxxx (click to reveal)   │  │
│ └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### ⚠️ IMPORTANT: Copy These Values NOW!

Click on each field to copy and save them:

1. **Host:** `dpg-xxxxx.frankfurt.render.com`
2. **Port:** `3306`
3. **Database:** `propflow`
4. **Username:** `propflow_user` (or similar)
5. **Password:** Click "Reveal" then copy

**Save these in a secure note!** You'll need them in the next steps.

---

## Step 6: Import Database Schema

Now you need to add tables to your database using the schema file.

### Option A: Using MySQL Command Line (Recommended)

1. **Install MySQL Client** (if not installed):
   
   **Windows (using Chocolatey):**
   ```bash
   choco install mysql
   ```
   
   **Or download:** https://dev.mysql.com/downloads/mysql/

2. **Connect to Database:**
   ```bash
   mysql -h dpg-xxxxx.frankfurt.render.com -u propflow_user -p propflow
   ```
   
   Replace:
   - `dpg-xxxxx.frankfurt.render.com` with your actual host
   - `propflow_user` with your actual username
   
   Press Enter, then paste your password when prompted.

3. **Import Schema:**
   
   Once connected, you'll see `mysql>` prompt:
   ```sql
   source c:/Users/dimit/Desktop/PropFlow/database/schema.sql
   ```
   
   Or from outside MySQL:
   ```bash
   mysql -h dpg-xxxxx.frankfurt.render.com -u propflow_user -p propflow < c:/Users/dimit/Desktop/PropFlow/database/schema.sql
   ```

4. **Verify Tables Created:**
   ```sql
   SHOW TABLES;
   ```
   
   You should see:
   ```
   +--------------------+
   | Tables_in_propflow |
   +--------------------+
   | appointments       |
   | clients            |
   | documents          |
   | properties         |
   | users              |
   +--------------------+
   ```

### Option B: Using MySQL Workbench (GUI)

1. **Download MySQL Workbench:** https://dev.mysql.com/downloads/workbench/

2. **Create New Connection:**
   - Click **"+"** next to "MySQL Connections"
   - Connection Name: `Render PropFlow`
   - Hostname: (paste from Step 5)
   - Port: `3306`
   - Username: (paste from Step 5)
   - Password: Click "Store in Keychain" and paste password
   - Default Schema: `propflow`
   - Click **"Test Connection"**
   - Click **"OK"**

3. **Import Schema:**
   - Double-click your new connection
   - Click **File** → **Run SQL Script**
   - Browse to: `c:/Users/dimit/Desktop/PropFlow/database/schema.sql`
   - Click **"Run"**

4. **Verify:**
   - Click refresh icon
   - You should see tables listed in left sidebar

---

## Step 7: Test Connection from Local Backend

Before deploying, test that your local backend can connect:

1. **Create `backend/.env` file:**
   ```bash
   cd c:/Users/dimit/Desktop/PropFlow/backend
   cp .env.example .env
   ```

2. **Edit `backend/.env`** with your Render credentials:
   ```bash
   NODE_ENV=development
   PORT=3001
   
   # Render MySQL Credentials
   DB_HOST=dpg-xxxxx.frankfurt.render.com
   DB_PORT=3306
   DB_NAME=propflow
   DB_USER=propflow_user
   DB_PASSWORD=your_password_here
   DB_SSL=true
   
   FRONTEND_URL=http://localhost:3000
   ALLOW_VERCEL_PREVIEWS=true
   ```

3. **Test connection:**
   ```bash
   cd c:/Users/dimit/Desktop/PropFlow/backend
   npm start
   ```

4. **Check output:**
   ```
   🚀 PropFlow Server Started
      Environment: development
      Port: 3001
   ✅ Database connected successfully
      Database: propflow
      Host: dpg-xxxxx.frankfurt.render.com
   ```

5. **Test health endpoint:**
   
   Open browser: http://localhost:3001/health
   
   Should see:
   ```json
   {
     "status": "healthy",
     "database": "connected",
     "timestamp": "2025-11-10T...",
     "uptime": 5.123,
     "environment": "development"
   }
   ```

---

## ✅ Database Setup Complete!

You now have:

- ✅ Render MySQL database created
- ✅ Database credentials saved
- ✅ Schema imported (tables created)
- ✅ Connection tested from local backend

---

## 🎯 Next Steps

Now that your database is ready, continue with backend deployment:

1. Go to **`DEPLOYMENT_GUIDE.md`** → **Part 3**
2. Deploy backend to Render Web Service
3. Use these same database credentials in backend environment variables

---

## 🆘 Troubleshooting

### Problem: "Access denied for user"

**Solution:**
- Double-check username and password
- Make sure you copied the full password (click reveal)
- Try connecting again

### Problem: "Can't connect to MySQL server"

**Solution:**
- Verify host is correct (should end in `.render.com`)
- Check port is `3306`
- Ensure SSL is enabled: `DB_SSL=true`
- Check your internet connection

### Problem: "Unknown database 'propflow'"

**Solution:**
- The database name must match what you set in Step 3
- Check Render dashboard for exact database name
- It should be `propflow` (lowercase)

### Problem: Schema import fails

**Solution:**
- Check that `database/schema.sql` file exists
- Verify you're in the correct directory
- Try importing via MySQL Workbench instead

---

## 📝 Quick Reference Commands

```bash
# Connect to database
mysql -h YOUR_HOST -u YOUR_USER -p YOUR_DATABASE

# Import schema
mysql -h YOUR_HOST -u YOUR_USER -p YOUR_DATABASE < database/schema.sql

# Show tables
mysql -h YOUR_HOST -u YOUR_USER -p YOUR_DATABASE -e "SHOW TABLES;"

# Test from backend
cd backend && npm start
curl http://localhost:3001/health
```

---

## 🔐 Security Reminder

- ✅ Never commit database credentials to Git
- ✅ Keep `backend/.env` in `.gitignore`
- ✅ Save credentials in secure password manager
- ✅ Don't share credentials in screenshots or logs

---

**Your database is ready!** Continue to DEPLOYMENT_GUIDE.md Part 3 to deploy your backend. 🚀
