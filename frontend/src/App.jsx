
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>

          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: "'DM Sans', sans-serif",
                borderRadius: '10px',
                background: '#1a1208',
                color: '#fdf8f0'
              }
            }}
          />

          <Navbar />

          <main className="max-w-7xl mx-auto px-6 py-6">

            <Routes>

              <Route path="/" element={<Home />} />

              <Route path="/books" element={<Books />} />

              <Route path="/books/:id" element={<BookDetail />} />

              <Route path="/login" element={<Login />} />

              <Route path="/register" element={<Register />} />

              <Route path="/cart" element={<Cart />} />

              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />

              
              <Route path="/admin" element={<AdminDashboard />} />

              <Route
                path="*"
                element={
                  <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '6rem', color: '#e2d5c0' }}>404</h1>
                    <h2>Page Not Found</h2>

                    <a
                      href="/"
                      style={{
                        marginTop: '20px',
                        display: 'inline-block',
                        background: '#c8820a',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '6px'
                      }}
                    >
                      Go Home
                    </a>

                  </div>
                }
              />

            </Routes>

          </main>

          <Footer />

        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

