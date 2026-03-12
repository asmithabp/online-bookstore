# 📚 Kitaab — Online Bookstore

A full-stack MERN (MongoDB, Express, React, Node.js) online bookstore with support for user authentication, shopping cart, order management, and an admin panel. Prices are displayed in Indian Rupees (₹).

---

## 🗂️ Project Structure

```
online-bookstore/
├── frontend/                    # React + Vite
│   ├── src/
│   │   ├── components/          # Navbar, Footer, BookCard, etc.
│   │   ├── context/             # AuthContext, CartContext
│   │   ├── pages/               # Home, Books, BookDetail, Cart, Checkout, Admin...
│   │   ├── utils/               # Axios instance
│   │   ├── App.jsx              # Router
│   │   └── main.jsx             # Entry point
│   ├── Dockerfile
│   └── vite.config.js
│
├── backend/                     # Node.js + Express
│   ├── controllers/             # authController, bookController, cartController, orderController
│   ├── models/                  # User, Book, Cart, Order
│   ├── routes/                  # authRoutes, bookRoutes, cartRoutes, orderRoutes
│   ├── middleware/              # authMiddleware (JWT), uploadMiddleware (Multer)
│   ├── config/
│   │   └── seed.js              # Sample data seeder
│   ├── uploads/                 # Book cover images
│   ├── server.js
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone and Install

```bash
# Backend
cd backend
cp .env.example .env        # Edit with your values
npm install
npm run seed                # Load sample books and users

# Frontend
cd ../frontend
cp .env.example .env        # Set VITE_API_URL
npm install
```

### 2. Start Dev Servers

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open **http://localhost:5173**

### 3. Demo Accounts (after seed)

| Role  | Email                   | Password  |
|-------|-------------------------|-----------|
| Admin | admin@bookstore.com     | admin123  |
| User  | user@bookstore.com      | user123   |

---

## 🐳 Docker Setup

### Run everything with Docker Compose

```bash
# Build and start all services (MongoDB, Backend, Frontend)
docker compose up --build

# Frontend: http://localhost:3000
# Backend API: http://localhost:5000/api
# MongoDB: localhost:27017
```

### Seed data in Docker

```bash
# After containers are running:
docker exec bookstore-backend node config/seed.js
```

### Stop containers

```bash
docker compose down
# To also remove volumes:
docker compose down -v
```

---

## 🌐 Deployment

### Frontend → Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project → Select `frontend/` folder
3. Set **Framework Preset**: Vite
4. Add environment variable:
   ```
   VITE_API_URL=https://your-render-backend-url.onrender.com
   ```
5. Click Deploy

### Backend → Render

1. Go to [render.com](https://render.com) → New Web Service
2. Connect your GitHub repo → Set **Root Directory**: `backend`
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Add environment variables:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/online-bookstore
   JWT_SECRET=your_very_secret_key_here
   NODE_ENV=production
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

### Database → MongoDB Atlas

1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster (M0 Sandbox)
3. Add database user and whitelist IP (`0.0.0.0/0` for Render)
4. Get connection string and use as `MONGO_URI`
5. Run seed: `node config/seed.js` (locally pointing to Atlas URI)

---

## 📡 API Reference

### Auth
| Method | Endpoint            | Access  | Description         |
|--------|---------------------|---------|---------------------|
| POST   | /api/auth/register  | Public  | Register new user   |
| POST   | /api/auth/login     | Public  | Login               |
| GET    | /api/auth/profile   | Private | Get profile         |
| PUT    | /api/auth/profile   | Private | Update profile      |
| GET    | /api/auth/users     | Admin   | Get all users       |

### Books
| Method | Endpoint         | Access  | Description              |
|--------|------------------|---------|--------------------------|
| GET    | /api/books       | Public  | Get all books (paginated)|
| GET    | /api/books/featured | Public | Get featured books    |
| GET    | /api/books/:id   | Public  | Get single book          |
| POST   | /api/books       | Admin   | Add new book + image     |
| PUT    | /api/books/:id   | Admin   | Update book              |
| DELETE | /api/books/:id   | Admin   | Delete book              |

### Cart
| Method | Endpoint          | Access  | Description         |
|--------|-------------------|---------|---------------------|
| GET    | /api/cart         | Private | Get user cart       |
| POST   | /api/cart         | Private | Add item to cart    |
| PUT    | /api/cart/:itemId | Private | Update item qty     |
| DELETE | /api/cart/:itemId | Private | Remove item         |
| DELETE | /api/cart/clear   | Private | Clear entire cart   |

### Orders
| Method | Endpoint              | Access  | Description         |
|--------|-----------------------|---------|---------------------|
| POST   | /api/orders           | Private | Create order        |
| GET    | /api/orders/my-orders | Private | User's orders       |
| GET    | /api/orders/:id       | Private | Order by ID         |
| GET    | /api/orders           | Admin   | All orders          |
| PUT    | /api/orders/:id/status| Admin   | Update status       |

---

## ✨ Features

### Customer
- 🏠 Home page with featured books and categories
- 🔍 Search and filter books by category, price, sort order
- 📖 Detailed book pages with specs
- 🛒 Shopping cart with quantity management
- 💳 Checkout with shipping address and payment method (COD / Online)
- 📦 Order history and tracking
- 🔐 JWT authentication (register/login)

### Admin
- ➕ Add new books with image upload
- ✏️ Edit existing books
- 🗑️ Delete books
- 📦 View and update order statuses
- 👤 View all registered users
- 📊 Dashboard with stats

---

## 🛠️ Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React 18, Vite, React Router v6     |
| HTTP Client | Axios                               |
| Styling     | Custom CSS (no framework)           |
| Backend     | Node.js, Express.js                 |
| Database    | MongoDB, Mongoose                   |
| Auth        | JWT, bcryptjs                       |
| File Upload | Multer                              |
| Container   | Docker, Docker Compose              |

---

## 📝 Environment Variables

### Backend `.env`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/online-bookstore
JWT_SECRET=change_this_to_a_long_random_string
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000
```

---

*Built with ❤️ for Indian book lovers. All prices in ₹ INR.*
