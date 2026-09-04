# Kade Manager — Perera Stores

> **A 4-hour hackathon project.** Single-tenant inventory & invoicing tool for **Perera Stores** — one Sri Lankan kade, two roles, built by a 4-person team.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)

### 1. Configure Environment

```bash
cd server
cp .env.example .env
# Edit .env and fill in your MONGO_URI from Atlas
```

### 2. Install Dependencies

```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 3. Seed the Database

```bash
cd server && npm run seed
```

This creates:
| Role  | Email                      | Password  |
|-------|----------------------------|-----------|
| Owner | owner@pererastores.lk      | owner123  |
| Staff | staff@pererastores.lk      | staff123  |

...and 10 sample Sri Lankan kade products with LKR prices.

### 4. Run in Development

```bash
# Terminal 1 — Backend (port 5000)
cd server && npm run dev

# Terminal 2 — Frontend (port 3000)
cd client && npm run dev
```

Open: **http://localhost:3000**

Health check: **http://localhost:5000/api/health**

---

## 👥 Team Module Ownership

This table tells each member exactly which files are theirs. **Do not touch files in other members' zones** to avoid merge conflicts.

### Member 1 — Dashboard

| Layer      | Files |
|------------|-------|
| Route      | `server/routes/dashboardRoutes.js` |
| Controller | `server/controllers/dashboardController.js` |
| Service    | `server/services/dashboardService.js` |
| Page       | `client/src/pages/DashboardPage.jsx` |
| Component  | `client/src/components/dashboard/SalesSummaryCard.jsx` |
| API        | `client/src/api/dashboardApi.js` |

**Your feature:** Dashboard stats (all users) + sales revenue summary (owner-only).  
**Endpoints you own:** `GET /api/dashboard/stats`, `GET /api/dashboard/sales`

---

### Member 2 — Inventory

| Layer      | Files |
|------------|-------|
| Route      | `server/routes/inventoryRoutes.js` |
| Controller | `server/controllers/inventoryController.js` |
| Service    | `server/services/inventoryService.js` |
| Model      | `server/models/Product.js` |
| Page       | `client/src/pages/InventoryPage.jsx` |
| Components | `client/src/components/inventory/ProductTable.jsx` |
|            | `client/src/components/inventory/ProductForm.jsx` |
| API        | `client/src/api/inventoryApi.js` |

**Your feature:** Full product CRUD. Staff can add/edit, only owner can delete.  
**Endpoints you own:** `GET/POST /api/inventory`, `GET/PUT/DELETE /api/inventory/:id`, `GET /api/inventory/low-stock`

---

### Member 3 — Invoices

| Layer      | Files |
|------------|-------|
| Route      | `server/routes/invoiceRoutes.js` |
| Controller | `server/controllers/invoiceController.js` |
| Service    | `server/services/invoiceService.js` |
| Model      | `server/models/Invoice.js` |
| Page       | `client/src/pages/NewInvoicePage.jsx` |
| Components | `client/src/components/invoice/InvoiceCard.jsx` |
|            | `client/src/components/invoice/InvoiceItemRow.jsx` |
| API        | `client/src/api/invoiceApi.js` |

**Your feature:** Create invoices (deducts stock), view single invoice.  
**Endpoints you own:** `POST /api/invoices`, `GET /api/invoices/:id`

---

### Member 4 — Shared UI & Invoice History

| Layer      | Files |
|------------|-------|
| Page       | `client/src/pages/InvoiceHistoryPage.jsx` |
|            | `client/src/pages/LoginPage.jsx` (shared) |
| Components | `client/src/components/shared/Navbar.jsx` |
|            | `client/src/components/shared/ProtectedRoute.jsx` |
|            | `client/src/components/shared/ErrorBanner.jsx` |
|            | `client/src/components/shared/Loader.jsx` |

**Your feature:** All shared UI primitives (Navbar, Loader, ErrorBanner, ProtectedRoute) + Invoice History page (view all invoices, expandable line items).

---

## 🔒 RBAC — Role Reference

| Action | owner | staff |
|--------|-------|-------|
| Login | ✅ | ✅ |
| View inventory | ✅ | ✅ |
| Add / edit product | ✅ | ✅ |
| **Delete product** | ✅ | ❌ |
| Create invoice | ✅ | ✅ |
| View invoice history | ✅ | ✅ |
| **View sales summary** | ✅ | ❌ |
| **Manage staff accounts** | ✅ | ❌ |

---

## 🗂️ Folder Structure

```
kade-manager/
├── server/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js                # JWT verification → req.user
│   │   ├── roleCheck.js           # roleCheck(['owner']) usage
│   │   ├── errorHandler.js        # Centralized error handler (last middleware)
│   │   └── asyncWrapper.js        # Eliminates try/catch in controllers
│   ├── models/
│   │   ├── User.js                # name, email, password, role
│   │   ├── Product.js             # inventory item schema
│   │   └── Invoice.js             # sale invoice + line items
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── inventoryRoutes.js     ← Member 2
│   │   ├── invoiceRoutes.js       ← Member 3
│   │   └── dashboardRoutes.js     ← Member 1
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── inventoryController.js ← Member 2
│   │   ├── invoiceController.js   ← Member 3
│   │   └── dashboardController.js ← Member 1
│   ├── services/
│   │   ├── authService.js
│   │   ├── inventoryService.js    ← Member 2
│   │   ├── invoiceService.js      ← Member 3
│   │   └── dashboardService.js    ← Member 1
│   ├── server.js                  # Entry point
│   ├── seed.js                    # Demo data seeder
│   └── .env.example               # Copy → .env
│
└── client/
    ├── src/
    │   ├── api/
    │   │   ├── axiosInstance.js    # Shared axios + JWT interceptor
    │   │   ├── authApi.js
    │   │   ├── inventoryApi.js     ← Member 2
    │   │   ├── invoiceApi.js       ← Member 3
    │   │   └── dashboardApi.js     ← Member 1
    │   ├── context/
    │   │   └── AuthContext.jsx     # user, role, login(), logout()
    │   ├── routes/
    │   │   └── AppRoutes.jsx       # React Router config
    │   ├── components/
    │   │   ├── shared/             ← Member 4
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── ProtectedRoute.jsx
    │   │   │   ├── ErrorBanner.jsx
    │   │   │   └── Loader.jsx
    │   │   ├── inventory/          ← Member 2
    │   │   │   ├── ProductTable.jsx
    │   │   │   └── ProductForm.jsx
    │   │   ├── invoice/            ← Member 3
    │   │   │   ├── InvoiceCard.jsx
    │   │   │   └── InvoiceItemRow.jsx
    │   │   └── dashboard/          ← Member 1
    │   │       └── SalesSummaryCard.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx       ← Member 4 (shared)
    │   │   ├── DashboardPage.jsx   ← Member 1
    │   │   ├── InventoryPage.jsx   ← Member 2
    │   │   ├── NewInvoicePage.jsx  ← Member 3
    │   │   └── InvoiceHistoryPage.jsx ← Member 4
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    └── vite.config.js
```

---

## 🌐 API Reference

### Auth
| Method | Endpoint | Auth | Access |
|--------|----------|------|--------|
| POST | `/api/auth/login` | None | Public |
| GET | `/api/auth/me` | Bearer | All |
| POST | `/api/auth/register` | Bearer | Owner only |
| GET | `/api/auth/users` | Bearer | Owner only |
| DELETE | `/api/auth/users/:id` | Bearer | Owner only |

### Inventory
| Method | Endpoint | Auth | Access |
|--------|----------|------|--------|
| GET | `/api/inventory` | Bearer | All |
| GET | `/api/inventory/low-stock` | Bearer | All |
| GET | `/api/inventory/:id` | Bearer | All |
| POST | `/api/inventory` | Bearer | All |
| PUT | `/api/inventory/:id` | Bearer | All |
| DELETE | `/api/inventory/:id` | Bearer | **Owner only** |

### Invoices
| Method | Endpoint | Auth | Access |
|--------|----------|------|--------|
| POST | `/api/invoices` | Bearer | All |
| GET | `/api/invoices` | Bearer | All |
| GET | `/api/invoices/:id` | Bearer | All |

### Dashboard
| Method | Endpoint | Auth | Access |
|--------|----------|------|--------|
| GET | `/api/dashboard/stats` | Bearer | All |
| GET | `/api/dashboard/sales?period=month` | Bearer | **Owner only** |

### Utility
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/health` | None |

---

## 📡 Standard API Response Format

All endpoints return:

```json
{
  "success": true | false,
  "message": "Human-readable description",
  "data": { ... } | null,
  "error": "Stack trace (dev only)"
}
```

---

## ⚙️ Environment Variables (`server/.env`)

| Variable | Example | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Express server port |
| `MONGO_URI` | `mongodb+srv://...` | MongoDB Atlas connection string |
| `JWT_SECRET` | `change_me_in_prod` | JWT signing secret |
| `JWT_EXPIRES_IN` | `7d` | Token expiry duration |
| `NODE_ENV` | `development` | Controls error detail level |

---

*Built for Perera Stores — single shop, one team, 4 hours. Ayubowan! 🙏*
