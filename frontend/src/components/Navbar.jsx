import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav style={{
      background: '#1a1208',
      color: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
    }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <span style={{ fontSize: '1.6rem' }}>📚</span>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#e8a020',
            letterSpacing: '-0.02em',
          }}>Kitaab</span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/books" style={{ color: '#d4c4a8', fontSize: '0.95rem', fontWeight: 500 }}
            className="nav-link">Browse Books</Link>

          {/* Cart */}
          <Link to="/cart" style={{ position: 'relative', color: 'white', display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.08)' }}>
            <span>🛒</span>
            <span style={{ fontSize: '0.9rem' }}>Cart</span>
            {itemCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px', right: '-6px',
                background: '#c8820a',
                color: 'white',
                borderRadius: '50%',
                width: '20px', height: '20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.72rem', fontWeight: 700,
              }}>{itemCount}</span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {isAdmin && (
                <Link to="/admin" style={{ color: '#e8a020', fontSize: '0.85rem', fontWeight: 600, background: 'rgba(200,130,10,0.15)', padding: '0.35rem 0.75rem', borderRadius: '6px' }}>
                  ⚙️ Admin
                </Link>
              )}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  style={{ background: '#c8820a', border: 'none', color: 'white', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem' }}
                >
                  {user.name[0].toUpperCase()}
                </button>
                {menuOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: '44px',
                    background: 'white', borderRadius: '10px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                    minWidth: '160px', overflow: 'hidden', zIndex: 200,
                  }}>
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2d5c0', fontSize: '0.85rem', color: '#3d3020', fontWeight: 600 }}>
                      {user.name}
                    </div>
                    <Link to="/orders" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '0.65rem 1rem', color: '#1a1208', fontSize: '0.9rem' }}>
                      📦 My Orders
                    </Link>
                    <button onClick={handleLogout} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.65rem 1rem', border: 'none', background: 'none', color: '#b03020', cursor: 'pointer', fontSize: '0.9rem' }}>
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-ghost btn-sm" style={{ color: '#d4c4a8' }}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
