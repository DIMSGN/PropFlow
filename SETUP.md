# PropFlow - Setup Guide / Οδηγός Εγκατάστασης

**🇬🇷 Ελληνικά** | **🇬🇧 English**

---

## 🇬🇷 Ελληνικά

### Προαπαιτούμενα

Βεβαιωθείτε ότι έχετε εγκατεστημένα:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MySQL** >= 8.0 (ή MariaDB >= 10.3)
- **Git**

### Βήμα 1: Clone Repository

```bash
git clone <your-repo-url>
cd PropFlow
```

### Βήμα 2: Εγκατάσταση Dependencies

```bash
# Εγκατάσταση και για backend και για frontend
npm run install:all

# Ή χειροκίνητα:
cd backend && npm install
cd ../frontend && npm install
```

### Βήμα 3: Ρύθμιση MySQL Database

#### 3.1 Δημιουργία Database

```sql
-- Συνδεθείτε στο MySQL
mysql -u root -p

-- Δημιουργήστε τη βάση
CREATE DATABASE propflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Δημιουργήστε user (προαιρετικό αλλά συνιστάται)
CREATE USER 'propflow_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON propflow.* TO 'propflow_user'@'localhost';
FLUSH PRIVILEGES;
```

#### 3.2 Import Schema

```bash
# Χρησιμοποιήστε το schema αρχείο
mysql -u root -p propflow < database/schema.sql

# Ή για CleverCloud:
mysql -u root -p propflow < database/clevercloud-schema.sql
```

### Βήμα 4: Ρύθμιση Environment Variables

#### 4.1 Backend (.env)

Δημιουργήστε το αρχείο `backend/.env`:

```bash
# Database Configuration
DB_NAME=propflow
DB_USER=propflow_user
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=3306
DB_SSL=false

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (για CORS)
FRONTEND_URL=http://localhost:3000

# Database Sync (ΜΟΝΟ σε development!)
SYNC_DB=false

# Connection Pool (προαιρετικά)
DB_POOL_MAX=10
DB_POOL_MIN=2
```

⚠️ **ΣΗΜΑΝΤΙΚΟ:**
- **SYNC_DB=false** σε παραγωγή! Χρησιμοποιήστε migrations.
- Αλλάξτε το `DB_PASSWORD` σε ισχυρό κωδικό
- Για παραγωγή, ενεργοποιήστε `DB_SSL=true`

#### 4.2 Frontend (.env)

Δημιουργήστε το αρχείο `frontend/.env`:

```bash
# API URL
REACT_APP_API_URL=http://localhost:3001

# Environment
NODE_ENV=development
```

### Βήμα 5: Εκκίνηση Εφαρμογής

#### Development Mode (Συνιστάται)

```bash
# Από το root directory
npm run dev

# Αυτό ξεκινά:
# - Backend στο http://localhost:3001
# - Frontend στο http://localhost:3000
```

#### Ή ξεχωριστά:

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

### Βήμα 6: Δημιουργία Demo Users (Προαιρετικό)

Εκτελέστε στο MySQL:

```sql
-- Admin user
INSERT INTO Users (full_name, email, password_hash, role, is_active, createdAt, updatedAt)
VALUES (
  'Admin User',
  'admin@goldenvisa.gr',
  '$2a$10$YourHashedPasswordHere',
  'admin',
  1,
  NOW(),
  NOW()
);

-- Agent user
INSERT INTO Users (full_name, email, password_hash, role, is_active, createdAt, updatedAt)
VALUES (
  'Agent User',
  'agent@goldenvisa.gr',
  '$2a$10$YourHashedPasswordHere',
  'agent',
  1,
  NOW(),
  NOW()
);
```

**Για να δημιουργήσετε hashed password:**

```bash
node -e "console.log(require('bcryptjs').hashSync('password123', 10))"
```

### Βήμα 7: Πρόσβαση στην Εφαρμογή

Ανοίξτε το browser στο: **http://localhost:3000**

**Login με:**
- Email: `admin@goldenvisa.gr`
- Password: `password123`

---

## Deployment σε Production

### Παραγωγική Βάση (Production Database)

1. **Χρησιμοποιήστε migrations αντί για sync:**

```bash
# Εγκατάσταση Sequelize CLI
npm install --save-dev sequelize-cli

# Δημιουργία migration
npx sequelize-cli migration:generate --name create-initial-schema

# Εκτέλεση migrations
npx sequelize-cli db:migrate
```

2. **Ενεργοποιήστε SSL:**

```bash
DB_SSL=true
```

3. **Χρησιμοποιήστε connection pooling:**

```bash
DB_POOL_MAX=20
DB_POOL_MIN=5
```

### Frontend Build

```bash
cd frontend
npm run build

# Το build θα είναι στο frontend/build/
```

### Backend για Production

1. **Χρησιμοποιήστε Process Manager (PM2):**

```bash
npm install -g pm2

# Εκκίνηση
pm2 start backend/server.js --name propflow-backend

# Auto-restart on reboot
pm2 startup
pm2 save
```

2. **Environment Variables:**

```bash
NODE_ENV=production
PORT=3001
DB_SSL=true
SYNC_DB=false  # ΣΗΜΑΝΤΙΚΟ!
```

### Nginx Configuration (Προαιρετικό)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /var/www/propflow/frontend/build;
        try_files $uri /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🇬🇧 English

### Prerequisites

Make sure you have installed:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MySQL** >= 8.0 (or MariaDB >= 10.3)
- **Git**

### Step 1: Clone Repository

```bash
git clone <your-repo-url>
cd PropFlow
```

### Step 2: Install Dependencies

```bash
# Install both backend and frontend dependencies
npm run install:all

# Or manually:
cd backend && npm install
cd ../frontend && npm install
```

### Step 3: Setup MySQL Database

#### 3.1 Create Database

```sql
-- Connect to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE propflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional but recommended)
CREATE USER 'propflow_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON propflow.* TO 'propflow_user'@'localhost';
FLUSH PRIVILEGES;
```

#### 3.2 Import Schema

```bash
# Use the schema file
mysql -u root -p propflow < database/schema.sql

# Or for CleverCloud:
mysql -u root -p propflow < database/clevercloud-schema.sql
```

### Step 4: Configure Environment Variables

#### 4.1 Backend (.env)

Create file `backend/.env`:

```bash
# Database Configuration
DB_NAME=propflow
DB_USER=propflow_user
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=3306
DB_SSL=false

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Database Sync (ONLY in development!)
SYNC_DB=false

# Connection Pool (optional)
DB_POOL_MAX=10
DB_POOL_MIN=2
```

⚠️ **IMPORTANT:**
- **SYNC_DB=false** in production! Use migrations instead.
- Change `DB_PASSWORD` to a strong password
- For production, enable `DB_SSL=true`

#### 4.2 Frontend (.env)

Create file `frontend/.env`:

```bash
# API URL
REACT_APP_API_URL=http://localhost:3001

# Environment
NODE_ENV=development
```

### Step 5: Start Application

#### Development Mode (Recommended)

```bash
# From root directory
npm run dev

# This starts:
# - Backend at http://localhost:3001
# - Frontend at http://localhost:3000
```

#### Or separately:

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

### Step 6: Create Demo Users (Optional)

Execute in MySQL:

```sql
-- Admin user
INSERT INTO Users (full_name, email, password_hash, role, is_active, createdAt, updatedAt)
VALUES (
  'Admin User',
  'admin@goldenvisa.gr',
  '$2a$10$YourHashedPasswordHere',
  'admin',
  1,
  NOW(),
  NOW()
);

-- Agent user
INSERT INTO Users (full_name, email, password_hash, role, is_active, createdAt, updatedAt)
VALUES (
  'Agent User',
  'agent@goldenvisa.gr',
  '$2a$10$YourHashedPasswordHere',
  'agent',
  1,
  NOW(),
  NOW()
);
```

**To generate hashed password:**

```bash
node -e "console.log(require('bcryptjs').hashSync('password123', 10))"
```

### Step 7: Access Application

Open browser at: **http://localhost:3000**

**Login with:**
- Email: `admin@goldenvisa.gr`
- Password: `password123`

---

## Production Deployment

### Production Database

1. **Use migrations instead of sync:**

```bash
# Install Sequelize CLI
npm install --save-dev sequelize-cli

# Create migration
npx sequelize-cli migration:generate --name create-initial-schema

# Run migrations
npx sequelize-cli db:migrate
```

2. **Enable SSL:**

```bash
DB_SSL=true
```

3. **Use connection pooling:**

```bash
DB_POOL_MAX=20
DB_POOL_MIN=5
```

### Frontend Build

```bash
cd frontend
npm run build

# Build will be in frontend/build/
```

### Backend for Production

1. **Use Process Manager (PM2):**

```bash
npm install -g pm2

# Start
pm2 start backend/server.js --name propflow-backend

# Auto-restart on reboot
pm2 startup
pm2 save
```

2. **Environment Variables:**

```bash
NODE_ENV=production
PORT=3001
DB_SSL=true
SYNC_DB=false  # CRITICAL!
```

### Nginx Configuration (Optional)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /var/www/propflow/frontend/build;
        try_files $uri /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔧 Troubleshooting

### Backend won't start

```bash
# Check MySQL connection
mysql -u propflow_user -p propflow

# Check environment variables
cat backend/.env

# Check logs
tail -f backend/logs/error.log
```

### Frontend can't connect to backend

1. Verify `REACT_APP_API_URL` in `frontend/.env`
2. Check CORS settings in `backend/server.js`
3. Ensure backend is running on port 3001

### Database errors

```bash
# Reset database (CAUTION: Deletes all data!)
mysql -u root -p -e "DROP DATABASE propflow; CREATE DATABASE propflow;"
mysql -u root -p propflow < database/schema.sql
```

---

**Need help? Open an issue on GitHub!**
