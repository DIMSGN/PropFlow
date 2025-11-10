# PropFlow API Documentation

**Base URL**: `http://localhost:3001` (development)  
**Production URL**: Configure via `REACT_APP_API_URL`

**Version**: 1.0.0  
**Content-Type**: `application/json`

---

## Authentication

⚠️ **CURRENT STATE**: Simplified authentication using headers (NOT production-ready)

### Headers Required

```http
user-id: <user_id>
```

**Example:**
```javascript
axios.defaults.headers.common["user-id"] = user.id;
```

🔴 **WARNING**: This authentication method is **INSECURE** and for demo purposes only.  
For production, implement JWT tokens or OAuth 2.0.

---

## API Endpoints

### Health Check

Check API server status.

**GET** `/health`

**Response 200:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "uptime": 3600.5,
  "environment": "development",
  "database": "connected"
}
```

---

## 👥 Users API

### Get All Users

**GET** `/api/users`

**Query Parameters:**
- `role` (optional): Filter by role (`admin` or `agent`)
- `is_active` (optional): Filter by active status (`true` or `false`)

**Response 200:**
```json
[
  {
    "id": 1,
    "full_name": "Admin User",
    "email": "admin@goldenvisa.gr",
    "role": "admin",
    "is_active": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "appointments": []
  }
]
```

### Get User by ID

**GET** `/api/users/:id`

**Response 200:**
```json
{
  "id": 1,
  "full_name": "Admin User",
  "email": "admin@goldenvisa.gr",
  "role": "admin",
  "is_active": true,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "appointments": [],
  "uploadedDocuments": []
}
```

### Create User

**POST** `/api/users`

**Request Body:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "agent",
  "is_active": true
}
```

**Response 201:**
```json
{
  "id": 5,
  "full_name": "John Doe",
  "email": "john@example.com",
  "role": "agent",
  "is_active": true,
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

### Update User

**PUT** `/api/users/:id`

**Request Body:**
```json
{
  "full_name": "John Doe Updated",
  "email": "john@example.com",
  "role": "admin",
  "is_active": false
}
```

**Response 200:**
```json
{
  "id": 5,
  "full_name": "John Doe Updated",
  "email": "john@example.com",
  "role": "admin",
  "is_active": false,
  "updatedAt": "2025-01-15T11:00:00.000Z"
}
```

### Delete User

**DELETE** `/api/users/:id`

**Response 200:**
```json
{
  "message": "User deleted successfully"
}
```

### Login

**POST** `/api/users/login`

**Request Body:**
```json
{
  "email": "admin@goldenvisa.gr",
  "password": "password123"
}
```

**Response 200:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "full_name": "Admin User",
    "email": "admin@goldenvisa.gr",
    "role": "admin",
    "is_active": true
  }
}
```

**Response 401:**
```json
{
  "error": "Invalid email or password"
}
```

---

## 🏠 Properties API

### Get All Properties

**GET** `/api/properties`

**Query Parameters:**
- `status` (optional): Filter by status (`available`, `reserved`, `sold`)
- `city` (optional): Filter by city name
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter

**Response 200:**
```json
[
  {
    "id": 1,
    "title": "Luxury Villa in Athens",
    "address": "123 Acropolis Street",
    "city": "Athens",
    "price": "450000.00",
    "description": "Beautiful villa with sea view",
    "status": "available",
    "clientId": null,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "client": null,
    "appointments": []
  }
]
```

### Get Property by ID

**GET** `/api/properties/:id`

**Response 200:**
```json
{
  "id": 1,
  "title": "Luxury Villa in Athens",
  "address": "123 Acropolis Street",
  "city": "Athens",
  "price": "450000.00",
  "description": "Beautiful villa with sea view",
  "status": "available",
  "clientId": 5,
  "client": {
    "id": 5,
    "first_name": "Maria",
    "last_name": "Papadopoulos",
    "email": "maria@example.com"
  },
  "appointments": []
}
```

### Create Property

**POST** `/api/properties`

**Request Body:**
```json
{
  "title": "Modern Apartment",
  "address": "456 Downtown Street",
  "city": "Thessaloniki",
  "price": 250000,
  "description": "Renovated apartment in city center",
  "status": "available",
  "clientId": null
}
```

**Response 201:**
```json
{
  "id": 10,
  "title": "Modern Apartment",
  "address": "456 Downtown Street",
  "city": "Thessaloniki",
  "price": "250000.00",
  "description": "Renovated apartment in city center",
  "status": "available",
  "clientId": null,
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

### Update Property

**PUT** `/api/properties/:id`

**Request Body:**
```json
{
  "title": "Modern Apartment - UPDATED",
  "status": "reserved",
  "clientId": 5
}
```

**Response 200:**
```json
{
  "id": 10,
  "title": "Modern Apartment - UPDATED",
  "address": "456 Downtown Street",
  "city": "Thessaloniki",
  "price": "250000.00",
  "status": "reserved",
  "clientId": 5,
  "updatedAt": "2025-01-15T11:00:00.000Z"
}
```

### Delete Property

**DELETE** `/api/properties/:id`

**Response 200:**
```json
{
  "message": "Property deleted successfully"
}
```

### Get Property Statistics

**GET** `/api/properties/stats`

**Response 200:**
```json
{
  "total": 25,
  "byStatus": [
    { "status": "available", "count": 15 },
    { "status": "reserved", "count": 7 },
    { "status": "sold", "count": 3 }
  ]
}
```

---

## 👤 Clients API

### Get All Clients

**GET** `/api/clients`

**Query Parameters:**
- `nationality` (optional): Filter by nationality
- `search` (optional): Search by name, email, or passport number

**Response 200:**
```json
[
  {
    "id": 1,
    "first_name": "Maria",
    "last_name": "Papadopoulos",
    "email": "maria@example.com",
    "phone": "+30 210 1234567",
    "nationality": "Greek",
    "passport_number": "AB123456",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "appointments": [],
    "documents": [],
    "properties": []
  }
]
```

### Get Client by ID

**GET** `/api/clients/:id`

**Response 200:**
```json
{
  "id": 1,
  "first_name": "Maria",
  "last_name": "Papadopoulos",
  "email": "maria@example.com",
  "phone": "+30 210 1234567",
  "nationality": "Greek",
  "passport_number": "AB123456",
  "appointments": [
    {
      "id": 5,
      "title": "Property Viewing",
      "startDate": "2025-01-20T10:00:00.000Z",
      "property": { "id": 1, "title": "Luxury Villa" },
      "assignedAgent": { "id": 2, "full_name": "Agent User" }
    }
  ],
  "documents": []
}
```

### Create Client

**POST** `/api/clients`

**Request Body:**
```json
{
  "first_name": "Dimitris",
  "last_name": "Georgiou",
  "email": "dimitris@example.com",
  "phone": "+30 210 9876543",
  "nationality": "Greek",
  "passport_number": "CD987654"
}
```

**Response 201:**
```json
{
  "id": 20,
  "first_name": "Dimitris",
  "last_name": "Georgiou",
  "email": "dimitris@example.com",
  "phone": "+30 210 9876543",
  "nationality": "Greek",
  "passport_number": "CD987654",
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

### Update Client

**PUT** `/api/clients/:id`

**Request Body:**
```json
{
  "phone": "+30 210 5555555",
  "email": "dimitris.new@example.com"
}
```

**Response 200:**
```json
{
  "id": 20,
  "first_name": "Dimitris",
  "last_name": "Georgiou",
  "email": "dimitris.new@example.com",
  "phone": "+30 210 5555555",
  "updatedAt": "2025-01-15T11:00:00.000Z"
}
```

### Delete Client

**DELETE** `/api/clients/:id`

**Response 200:**
```json
{
  "message": "Client deleted successfully"
}
```

### Get Client Statistics

**GET** `/api/clients/stats`

**Response 200:**
```json
{
  "total": 50,
  "byNationality": [
    { "nationality": "Greek", "count": 20 },
    { "nationality": "Chinese", "count": 15 },
    { "nationality": "Russian", "count": 10 },
    { "nationality": "Other", "count": 5 }
  ]
}
```

---

## 📅 Appointments API

### Get All Appointments

**GET** `/api/appointments`

**Query Parameters:**
- `status` (optional): Filter by status (`scheduled`, `confirmed`, `completed`, `cancelled`)
- `clientId` (optional): Filter by client
- `propertyId` (optional): Filter by property
- `assignedUserId` (optional): Filter by assigned agent
- `startDate` (optional): Filter by start date (ISO 8601)
- `endDate` (optional): Filter by end date (ISO 8601)

**Response 200:**
```json
[
  {
    "id": 1,
    "title": "Property Viewing - Luxury Villa",
    "description": "First viewing of Athens villa",
    "startDate": "2025-01-20T10:00:00.000Z",
    "endDate": "2025-01-20T11:00:00.000Z",
    "status": "scheduled",
    "notes": "Client prefers morning appointments",
    "clientId": 5,
    "propertyId": 1,
    "assignedUserId": 2,
    "createdAt": "2025-01-15T00:00:00.000Z",
    "updatedAt": "2025-01-15T00:00:00.000Z",
    "client": {
      "id": 5,
      "first_name": "Maria",
      "last_name": "Papadopoulos"
    },
    "property": {
      "id": 1,
      "title": "Luxury Villa in Athens"
    },
    "assignedAgent": {
      "id": 2,
      "full_name": "Agent User"
    },
    "documents": []
  }
]
```

### Get Appointment by ID

**GET** `/api/appointments/:id`

**Response 200:**
```json
{
  "id": 1,
  "title": "Property Viewing - Luxury Villa",
  "description": "First viewing of Athens villa",
  "startDate": "2025-01-20T10:00:00.000Z",
  "endDate": "2025-01-20T11:00:00.000Z",
  "status": "scheduled",
  "notes": "Client prefers morning appointments",
  "client": { ... },
  "property": { ... },
  "assignedAgent": { ... },
  "documents": []
}
```

### Create Appointment

**POST** `/api/appointments`

**Request Body:**
```json
{
  "title": "Contract Signing",
  "description": "Final contract signing for villa purchase",
  "startDate": "2025-01-25T14:00:00.000Z",
  "endDate": "2025-01-25T15:30:00.000Z",
  "status": "scheduled",
  "notes": "Bring lawyer",
  "clientId": 5,
  "propertyId": 1,
  "assignedUserId": 2
}
```

**Response 201:**
```json
{
  "id": 15,
  "title": "Contract Signing",
  "startDate": "2025-01-25T14:00:00.000Z",
  "endDate": "2025-01-25T15:30:00.000Z",
  "status": "scheduled",
  "client": { ... },
  "property": { ... },
  "assignedAgent": { ... }
}
```

### Update Appointment

**PUT** `/api/appointments/:id`

**Request Body:**
```json
{
  "status": "confirmed",
  "notes": "Client confirmed attendance"
}
```

**Response 200:**
```json
{
  "id": 15,
  "title": "Contract Signing",
  "status": "confirmed",
  "notes": "Client confirmed attendance",
  "updatedAt": "2025-01-15T11:00:00.000Z"
}
```

### Delete Appointment

**DELETE** `/api/appointments/:id`

**Response 200:**
```json
{
  "message": "Appointment deleted successfully"
}
```

---

## 📄 Documents API

### Upload Document

**POST** `/api/appointments/:id/upload`

**Content-Type**: `multipart/form-data`

**Request Body (Form Data):**
- `document` (file): The file to upload

**Allowed file types:**
- Images: `.jpg`, `.jpeg`, `.png`, `.gif`
- Documents: `.pdf`, `.doc`, `.docx`, `.xls`, `.xlsx`, `.txt`

**Max file size:** 5MB

**Response 200:**
```json
{
  "message": "Document uploaded successfully",
  "document": {
    "id": 25,
    "filename": "1-1705317600000-passport.pdf",
    "originalName": "passport.pdf",
    "path": "uploads/1-1705317600000-passport.pdf",
    "appointmentId": 1
  }
}
```

**Error 400:**
```json
{
  "error": "Invalid file type. Only images, PDFs, and documents are allowed."
}
```

### Get Document Names

**GET** `/api/appointments/:id/documents`

**Response 200:**
```json
[
  {
    "id": 25,
    "name": "passport.pdf",
    "path": "uploads/1-1705317600000-passport.pdf"
  },
  {
    "id": 26,
    "name": "contract.pdf",
    "path": "uploads/1-1705318000000-contract.pdf"
  }
]
```

### Delete Document

**DELETE** `/api/appointments/:id/documents/:documentName`

**Response 200:**
```json
{
  "message": "Document deleted successfully"
}
```

**Error 404:**
```json
{
  "error": "Document not found"
}
```

---

## Error Responses

### Standard Error Format

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "details": { ... }
}
```

### Common HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Validation error or invalid input
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

### Example Error Responses

**400 Validation Error:**
```json
{
  "errors": [
    {
      "msg": "Title is required",
      "param": "title",
      "location": "body"
    },
    {
      "msg": "End date must be after start date",
      "param": "endDate",
      "location": "body"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "error": "Authentication required",
  "message": "No user credentials provided"
}
```

**404 Not Found:**
```json
{
  "error": "Not Found",
  "message": "Cannot GET /api/invalid-endpoint"
}
```

**500 Server Error:**
```json
{
  "error": "Internal Server Error",
  "message": "Database connection failed"
}
```

---

## Rate Limiting

⚠️ **NOT IMPLEMENTED** - This API currently has no rate limiting.

**Recommended for production:**
- 100 requests per 15 minutes per IP
- Use `express-rate-limit` package

---

## Pagination

⚠️ **NOT IMPLEMENTED** - All endpoints return ALL records.

**Critical issue**: Will cause performance problems with large datasets.

**Recommended for production:**
```
GET /api/clients?page=1&limit=20&sort=createdAt&order=DESC
```

---

## Changelog

### Version 1.0.0 (Current)
- Initial API release
- Basic CRUD operations for all entities
- File upload support
- Simple header-based authentication (INSECURE)

### Planned for 2.0.0
- JWT authentication
- Pagination support
- Rate limiting
- Webhooks
- API versioning (/v1/, /v2/)

---

**Questions? Issues? Open a GitHub issue!**
