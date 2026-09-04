# 🏪 Kade Manager — Perera Stores

A single-tenant **Inventory and Invoicing System** for "Perera Stores", a Sri Lankan retail shop (*kade*). Built using the full **MERN Stack** (MongoDB Atlas, Express.js, React + Vite, Node.js) with role-based access control (RBAC).

---

## 👥 4-Member Team File Ownership

| Member | Role / Area | Assigned Files & Directories |
|---|---|---|
| **Member 1 (Database & Models)** | Backend Schemas & Seeding | `server/config/db.js`<br>`server/models/User.js`<br>`server/models/Product.js`<br>`server/models/Invoice.js`<br>`server/seed.js` |
| **Member 2 (API & Controllers)** | Server Routes & Middleware | `server/server.js`<br>`server/middleware/auth.js`<br>`server/middleware/roleCheck.js`<br>`server/middleware/errorHandler.js`<br>`server/routes/*`<br>`server/controllers/*`<br>`server/services/*` |
| **Member 3 (Frontend Core)** | State, Auth, Routing & API | `client/src/api/*`<br>`client/src/context/AuthContext.jsx`<br>`client/src/routes/AppRoutes.jsx`<br>`client/src/components/shared/*` |
| **Member 4 (Frontend UI/Pages)** | Page Views & User Experience | `client/src/pages/LoginPage.jsx`<br>`client/src/pages/DashboardPage.jsx`<br>`client/src/pages/InventoryPage.jsx`<br>`client/src/pages/NewInvoicePage.jsx`<br>`client/src/pages/InvoiceHistoryPage.jsx` |

---

## 🏗️ Architecture & Project Structure

```text
/
├── server/
│   ├── config/
│   │   └── db.js               # MongoDB Mongoose connection
│   ├── models/
│   │   ├── User.js             # User model (name, email, password, role: 'owner'|'staff')
│   │   ├── Product.js          # Product model (name, category, unit, quantity, unitPrice, lowStockThreshold)
│   │   └── Invoice.js          # Invoice model (customerName, items, totalAmount, createdBy)
│   ├── middleware/
│   │   ├── auth.js             # JWT Bearer verification -> attaches req.user
│   │   ├── roleCheck.js        # Multi-role permission check
│   │   ├── errorHandler.js     # Centralized error handler
│   │   └── asyncWrapper.js     # Async catch handler
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth
│   │   ├── inventoryRoutes.js  # /api/inventory
│   │   ├── invoiceRoutes.js    # /api/invoices
│   │   └── dashboardRoutes.js  # /api/dashboard
│   ├── controllers/            # Request handlers
│   ├── services/               # Database queries & business logic
│   ├── seed.js                 # Seed default accounts & 10 Sri Lankan kade products
│   ├── server.js               # Express server entry point & GET /api/health
│   ├── package.json
│   └── .env.example
│
└── client/
    ├── src/
    │   ├── api/
    │   │   ├── axiosInstance.js    # Pre-configured Axios with JWT interceptors
    │   │   ├── authApi.js          # Auth endpoints
    │   │   ├── inventoryApi.js     # Inventory CRUD endpoints
    │   │   ├── invoiceApi.js       # Invoice generation & history
    │   │   └── dashboardApi.js     # Sales analytics endpoints
    │   ├── context/
    │   │   └── AuthContext.jsx     # Global JWT & user state ('owner' | 'staff')
    │   ├── components/
    │   │   └── shared/
    │   │       ├── Navbar.jsx          # Top navigation with user badge & logout
    │   │       ├── ProtectedRoute.jsx  # Role-based route guard
    │   │       ├── ErrorBanner.jsx     # Alert banner
    │   │       └── Loader.jsx          # Spinner loader
    │   ├── pages/
    │   │   ├── LoginPage.jsx           # Sign in with quick-login buttons
    │   │   ├── DashboardPage.jsx       # Owner sales stats & staff quick links
    │   │   ├── InventoryPage.jsx       # Stock lookup, search, add form, delete (owner only)
    │   │   ├── NewInvoicePage.jsx      # POS cart, stock validation, checkout
    │   │   └── InvoiceHistoryPage.jsx  # Past transactions with item breakdown
    │   ├── routes/
    │   │   └── AppRoutes.jsx       # Route definitions
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## ⚙️ Setup & Running

### 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB Atlas URI and JWT Secret
# Example:
# MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/kade-manager
# JWT_SECRET=supersecretjwtkey

# Seed initial store data:
node seed.js

# Start API server on port 5000:
npm run dev
```

### 2. Frontend Setup

```bash
cd client
npm install
# Start Vite development server on port 5173:
npm run dev
```

Visit: `http://localhost:5173`

---

## 🔑 Default Test Accounts (from `seed.js`)

| Email | Password | Role | Permissions |
|---|---|---|---|
| `owner@pererastores.lk` | `owner123` | **owner** | Full access: View revenue analytics, add/delete inventory products, register users, issue invoices. |
| `staff@pererastores.lk` | `staff123` | **staff** | Restricted access: View stock levels, issue invoices, view history. *(Cannot delete products or view sales revenue)* |

---

## 🛡️ Role-Gating Implementation Matrix

| Action / View | Owner | Staff | Enforced At |
|---|---|---|---|
| View Sales Analytics Card | ✅ | ❌ | `dashboardRoutes.js` (`roleCheck(['owner'])`) + `DashboardPage.jsx` |
| Add / Delete Products | ✅ | ❌ | `inventoryRoutes.js` + `InventoryPage.jsx` (Delete button hidden) |
| Issue Invoices / Billing | ✅ | ✅ | `invoiceRoutes.js` + `NewInvoicePage.jsx` |
| View Past Invoices | ✅ | ✅ | `invoiceRoutes.js` + `InvoiceHistoryPage.jsx` |
| Register New Accounts | ✅ | ❌ | `authRoutes.js` (`roleCheck(['owner'])`) |
