import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: '#1a1208', color: '#a89880', padding: '3rem 0 1.5rem' }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.4rem' }}>📚</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: '#e8a020', fontWeight: 700 }}>Kitaab</span>
          </div>
          <p style={{ fontSize: '0.88rem', lineHeight: 1.7 }}>
            Your trusted online bookstore. Discover, read, and explore thousands of books across all genres.
          </p>
        </div>
        <div>
          <h4 style={{ color: '#d4c4a8', marginBottom: '0.75rem', fontFamily: "'Playfair Display', serif" }}>Browse</h4>
          {['Fiction', 'Non-Fiction', 'Science', 'Technology', 'Biography'].map(cat => (
            <Link key={cat} to={`/books?category=${cat}`} style={{ display: 'block', color: '#a89880', fontSize: '0.88rem', marginBottom: '0.35rem' }}>{cat}</Link>
          ))}
        </div>
        <div>
          <h4 style={{ color: '#d4c4a8', marginBottom: '0.75rem', fontFamily: "'Playfair Display', serif" }}>Account</h4>
          <Link to="/login" style={{ display: 'block', color: '#a89880', fontSize: '0.88rem', marginBottom: '0.35rem' }}>Login</Link>
          <Link to="/register" style={{ display: 'block', color: '#a89880', fontSize: '0.88rem', marginBottom: '0.35rem' }}>Register</Link>
          <Link to="/cart" style={{ display: 'block', color: '#a89880', fontSize: '0.88rem', marginBottom: '0.35rem' }}>Cart</Link>
          <Link to="/orders" style={{ display: 'block', color: '#a89880', fontSize: '0.88rem', marginBottom: '0.35rem' }}>Orders</Link>
        </div>
        <div>
          <h4 style={{ color: '#d4c4a8', marginBottom: '0.75rem', fontFamily: "'Playfair Display', serif" }}>Info</h4>
          <p style={{ fontSize: '0.88rem', marginBottom: '0.5rem' }}>📍 Bengaluru, India</p>
          <p style={{ fontSize: '0.88rem', marginBottom: '0.5rem' }}>✉️ hello@kitaab.in</p>
          <p style={{ fontSize: '0.88rem' }}>🕐 Mon–Sat, 9am–6pm</p>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.83rem' }}>
        © {new Date().getFullYear()} Kitaab Online Bookstore. All rights reserved. Prices in ₹ INR.
      </div>
    </div>
  </footer>
);

export default Footer;
