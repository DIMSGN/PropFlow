# PropFlow - Property & Client Management System

**🇬🇷 Ελληνικά** | **🇬🇧 English**

---

## 🇬🇷 Ελληνικά

### Τι είναι το PropFlow;

Το **PropFlow** είναι ένα ολοκληρωμένο σύστημα διαχείρισης πελατών και ακινήτων (CMS) που σχεδιάστηκε για εταιρείες που ασχολούνται με Golden Visa, real estate, και διαχείριση πελατών. Παρέχει:

- 📅 **Διαχείριση Ραντεβού**: Ημερολόγιο με πλήρη εποπτεία συναντήσεων
- 👥 **Διαχείριση Πελατών**: Αρχείο πελατών με στοιχεία επικοινωνίας και έγγραφα
- 🏠 **Διαχείριση Ακινήτων**: Κατάλογος διαθέσιμων ακινήτων με τιμές και περιγραφές
- 📄 **Διαχείριση Εγγράφων**: Ανέβασμα και αποθήκευση αρχείων ανά πελάτη/ραντεβού
- 👤 **Διαχείριση Χρηστών**: Ρόλοι (Admin/Agent) με διαφορετικά δικαιώματα

### Τεχνολογίες

**Backend:**
- Node.js + Express.js
- MySQL (Sequelize ORM)
- RESTful API
- bcrypt για κρυπτογράφηση κωδικών

**Frontend:**
- React 18
- Material-UI (MUI)
- React Router v6
- Axios για API calls
- React Big Calendar για το ημερολόγιο

### Γρήγορη Εκκίνηση

```bash
# 1. Clone το repository
git clone <your-repo-url>
cd PropFlow

# 2. Εγκατάσταση dependencies
npm run install:all

# 3. Ρύθμιση .env αρχείων (δες SETUP.md)
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Εκκίνηση development servers
npm run dev
```

Η εφαρμογή θα είναι διαθέσιμη στο:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

### Demo Accounts

```
Admin:  admin@goldenvisa.gr / password123
Agent:  agent@goldenvisa.gr / password123
```

⚠️ **ΠΡΟΣΟΧΗ**: Αλλάξτε αυτούς τους κωδικούς σε παραγωγή!

### Δομή Project

```
PropFlow/
├── backend/          # Node.js/Express server
│   ├── config/       # Database configuration
│   ├── controllers/  # Business logic
│   ├── models/       # Sequelize models
│   ├── routes/       # API endpoints
│   └── middleware/   # Auth & validation
├── frontend/         # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── context/      # React Context (Auth)
│   │   ├── hooks/        # Custom hooks
│   │   └── config/       # API configuration
└── database/         # SQL schemas
```

### Χαρακτηριστικά

✅ **Ολοκληρωμένο Dashboard** με στατιστικά  
✅ **Calendar View** για οπτικοποίηση ραντεβού  
✅ **CRUD Operations** για όλες τις οντότητες  
✅ **File Upload** για έγγραφα πελατών  
✅ **Role-Based Access** (Admin/Agent)  
✅ **Dark Mode** UI  
✅ **Responsive Design** για όλες τις συσκευές  

### Known Issues & Future Improvements

⚠️ **Areas for Enhancement:**

1. **Authentication**: Currently using simplified header-based auth (fine for learning/demo)
   - Future: Implement JWT tokens for production use
   
2. **Testing**: No automated tests yet
   - Future: Add Jest for backend, React Testing Library for frontend

3. **Pagination**: Endpoints return all records
   - Future: Add pagination with limit/offset

4. **File Storage**: Uploads stored locally in filesystem
   - Future: Migrate to cloud storage (AWS S3, Cloudinary)

5. **Logging**: Using console.log for debugging
   - Future: Implement structured logging (Winston, Pino)

These are **learning opportunities**, not blockers! The app works well for its current purpose.

======================================================================

### Documentation

- 📖 [SETUP.md](./SETUP.md) - Οδηγίες εγκατάστασης και ρύθμισης
- 📖 [API.md](./API.md) - API Documentation (endpoints, parameters)

### License

MIT License - Ελεύθερο για χρήση και τροποποίηση

---

## 🇬🇧 English

### What is PropFlow?

**PropFlow** is a comprehensive Property and Client Management System (CMS) designed for companies dealing with Golden Visa programs, real estate, and client management. It provides:

- 📅 **Appointment Management**: Full calendar with meeting oversight
- 👥 **Client Management**: Client database with contact details and documents
- 🏠 **Property Management**: Property catalog with prices and descriptions
- 📄 **Document Management**: Upload and store files per client/appointment
- 👤 **User Management**: Roles (Admin/Agent) with different permissions

### Tech Stack

**Backend:**
- Node.js + Express.js
- MySQL (Sequelize ORM)
- RESTful API
- bcrypt for password hashing

**Frontend:**
- React 18
- Material-UI (MUI)
- React Router v6
- Axios for API calls
- React Big Calendar for calendar views

### Quick Start

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd PropFlow

# 2. Install dependencies
npm run install:all

# 3. Setup environment files (see SETUP.md)
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Start development servers
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

### Demo Accounts

```
Admin:  admin@goldenvisa.gr / password123
Agent:  agent@goldenvisa.gr / password123
```

⚠️ **WARNING**: Change these credentials in production!

### Project Structure

```
PropFlow/
├── backend/          # Node.js/Express server
│   ├── config/       # Database configuration
│   ├── controllers/  # Business logic
│   ├── models/       # Sequelize models
│   ├── routes/       # API endpoints
│   └── middleware/   # Auth & validation
├── frontend/         # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── context/      # React Context (Auth)
│   │   ├── hooks/        # Custom hooks
│   │   └── config/       # API configuration
└── database/         # SQL schemas
```

### Features

✅ **Comprehensive Dashboard** with statistics  
✅ **Calendar View** for appointment visualization  
✅ **CRUD Operations** for all entities  
✅ **File Upload** for client documents  
✅ **Role-Based Access** (Admin/Agent)  
✅ **Dark Mode** UI  
✅ **Responsive Design** for all devices  

### Known Issues & Limitations

⚠️ **Areas for Enhancement:**

1. **Authentication**: Currently using simplified header-based auth (fine for learning/demo)
   - Future: Implement JWT tokens for production use
   
2. **Testing**: No automated tests yet
   - Future: Add Jest for backend, React Testing Library for frontend

3. **Pagination**: Endpoints return all records
   - Future: Add pagination with limit/offset

4. **File Storage**: Uploads stored locally in filesystem
   - Future: Migrate to cloud storage (AWS S3, Cloudinary)

5. **Logging**: Using console.log for debugging
   - Future: Implement structured logging (Winston, Pino)

These are **learning opportunities**, not blockers! The app works well for its current purpose.

### Documentation

- 📖 [SETUP.md](./SETUP.md) - Installation and configuration guide
- 📖 [API.md](./API.md) - API Documentation (endpoints, parameters)

### License

MIT License - Free to use and modify

---

## 🤝 Contributing

Contributions are welcome! Here are some areas for improvement:

1. **Security**: Implement JWT authentication
2. **Testing**: Add test coverage
3. **Performance**: Add pagination and caching
4. **Features**: New features and enhancements
5. **Documentation**: Improve docs and examples

Feel free to open issues or submit pull requests!

---

## 📧 Support

For questions or issues, please open a GitHub issue.

**Developed with 💙 in Greece**
