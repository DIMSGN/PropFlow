# 🗄️ How to Add PostgreSQL Database to Render

## ✅ Step-by-Step Guide (Render Free PostgreSQL)

Since Render's free tier now uses **PostgreSQL** (not MySQL), here's how to set it up:

---

## Step 1: Create PostgreSQL Database

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** (top right corner)
3. **Select "PostgreSQL"** from the dropdown

---

## Step 2: Configure Database

Fill in these settings:

| Field | Value |
|-------|-------|
| **Name** | `propflow-db` |
| **Database** | `propflow` |
| **User** | *(leave blank - auto-generated)* |
| **Region** | Oregon or Frankfurt (closest to you) |
| **PostgreSQL Version** | 16 (latest) |
| **Datadog API Key** | *(leave blank)* |
| **Plan** | **Free** ✓ |

Click **"Create Database"**

⏳ Wait 2-3 minutes for provisioning...

---

## Step 3: Get Connection Details

Once created, you'll see the database dashboard. Click on **"Connect"** or scroll to **"Connections"** section.

You'll see:

### Internal Database URL:
```
postgres://user:password@dpg-xxxxx-a.oregon-postgres.render.com/propflow
```

### Connection Details:
- **Host**: `dpg-xxxxx-a.oregon-postgres.render.com`
- **Port**: `5432`
- **Database**: `propflow`
- **Username**: `propflow_user` (or similar)
- **Password**: `xxxxxxxxxxxxx` (click to reveal)

**⚠️ SAVE THESE NOW!** Copy to a secure note.

---

## Step 4: Import Schema

You have 2 easy options:

### **Option A: Use Render's Built-in Shell (Easiest!)**

1. In your database dashboard, click the **"Shell"** tab
2. This opens a PostgreSQL command line (psql)
3. Now you need to convert your MySQL schema to PostgreSQL

**Quick conversion:**
- Open `c:/Users/dimit/Desktop/PropFlow/database/schema.sql`
- PostgreSQL uses mostly the same SQL, but a few changes needed

I'll help you with this - see the converted schema below!

### **Option B: Use pgAdmin (GUI Tool)**

1. Download pgAdmin: https://www.pgadmin.org/download/
2. Create new server connection with Render credentials
3. Import the schema file

---

## Step 5: PostgreSQL Schema (Converted)

Since your original schema is for MySQL, here's the PostgreSQL-compatible version.

In Render's Shell tab, paste this:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'agent',
  "firstName" VARCHAR(255),
  "lastName" VARCHAR(255),
  phone VARCHAR(50),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'active',
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  address VARCHAR(500) NOT NULL,
  type VARCHAR(100),
  price DECIMAL(15, 2),
  area DECIMAL(10, 2),
  bedrooms INTEGER,
  bathrooms INTEGER,
  description TEXT,
  status VARCHAR(50) DEFAULT 'available',
  "clientId" INTEGER REFERENCES clients(id) ON DELETE SET NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  "startTime" TIMESTAMP NOT NULL,
  "endTime" TIMESTAMP NOT NULL,
  location VARCHAR(500),
  status VARCHAR(50) DEFAULT 'scheduled',
  type VARCHAR(100),
  "clientId" INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  "propertyId" INTEGER REFERENCES properties(id) ON DELETE SET NULL,
  "userId" INTEGER REFERENCES users(id) ON DELETE SET NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  "originalName" VARCHAR(255),
  "mimeType" VARCHAR(100),
  size INTEGER,
  path VARCHAR(500),
  "appointmentId" INTEGER REFERENCES appointments(id) ON DELETE CASCADE,
  "uploadedBy" INTEGER REFERENCES users(id) ON DELETE SET NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_start ON appointments("startTime");
CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments("clientId");
CREATE INDEX IF NOT EXISTS idx_appointments_property ON appointments("propertyId");
CREATE INDEX IF NOT EXISTS idx_properties_client ON properties("clientId");
CREATE INDEX IF NOT EXISTS idx_documents_appointment ON documents("appointmentId");
```

**Press Enter to execute!**

---

## Step 6: Verify Tables Created

In the Render Shell, run:

```sql
\dt
```

You should see:
```
            List of relations
 Schema |     Name      | Type  |    Owner     
--------+---------------+-------+--------------
 public | appointments  | table | propflow_user
 public | clients       | table | propflow_user
 public | documents     | table | propflow_user
 public | properties    | table | propflow_user
 public | users         | table | propflow_user
```

✅ **Perfect!** Tables created.

---

## Step 7: Update Backend Environment Variables

Update your `backend/.env` file:

```bash
NODE_ENV=development
PORT=3001

# PostgreSQL Configuration
DB_DIALECT=postgres
DB_HOST=dpg-xxxxx.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=propflow
DB_USER=propflow_user
DB_PASSWORD=<your-password-from-render>
DB_SSL=true

DB_POOL_MAX=5
DB_POOL_MIN=1

FRONTEND_URL=http://localhost:3000
ALLOW_VERCEL_PREVIEWS=true
```

---

## Step 8: Test Connection

```bash
cd c:/Users/dimit/Desktop/PropFlow/backend
npm start
```

You should see:
```
✅ Database connected successfully
   Database: propflow
   Host: dpg-xxxxx.oregon-postgres.render.com
```

Test health endpoint:
```bash
curl http://localhost:3001/health
```

Should return:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

---

## ✅ Done!

Your PostgreSQL database is ready! Your app now supports both MySQL and PostgreSQL.

---

## 🎯 Next Steps

Continue with deployment:
1. Deploy backend to Render (Part 3 of DEPLOYMENT_GUIDE.md)
2. Use these PostgreSQL credentials in environment variables
3. Deploy frontend to Vercel

---

## 🆘 Troubleshooting

### "relation does not exist"
- Make sure you ran the schema in Step 5
- Verify tables exist with `\dt` command

### "Connection refused"
- Check host and port are correct
- Verify `DB_SSL=true` is set
- Ensure password doesn't have special characters escaped

### "Database does not exist"
- Database name must be exactly `propflow`
- Check Render dashboard for the exact name

---

**Your database is ready!** PostgreSQL is actually better than MySQL for production use. 🚀
