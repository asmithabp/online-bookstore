require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const googleBooks = require("./routes/googleBooks");

const app = express();


// ─────────────────────────────────────
// CORS Configuration
// ─────────────────────────────────────

const allowedOrigins = [
  "http://localhost:5173",
  "https://online-bookstore-inky.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {

      // allow requests with no origin (mobile apps, postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "CORS policy does not allow this origin.";
        return callback(new Error(msg), false);
      }

      return callback(null, true);
    },
    credentials: true
  })
);


// ─────────────────────────────────────
// Middleware
// ─────────────────────────────────────

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ─────────────────────────────────────
// API Routes
// ─────────────────────────────────────

app.use("/api/google-books", googleBooks);
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);


// ─────────────────────────────────────
// Health Check Route
// ─────────────────────────────────────

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Online Bookstore API is running"
  });
});


// ─────────────────────────────────────
// Error Handling Middleware
// ─────────────────────────────────────

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});


// ─────────────────────────────────────
// 404 Route Handler
// ─────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});


// ─────────────────────────────────────
// MongoDB Connection
// ─────────────────────────────────────

const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI not found in environment variables");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {

    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  })
  .catch((err) => {

    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);

  });