import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, updateItem, removeItem, loading } = useCart();
  const items = cart?.items || [];
  const subtotal = cart?.totalAmount || 0;
  const shipping = subtotal >= 500 ? 0 : 49;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
        <h2 style={{ marginBottom: '0.75rem' }}>Your cart is empty</h2>
        <p style={{ color: '#8a7e70', marginBottom: '2rem' }}>Discover books you'll love and add them to your cart.</p>
        <Link to="/books" className="btn btn-primary btn-lg">Browse Books</Link>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 style={{ marginBottom: '2rem' }}>Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map(item => (
              <div key={item._id} className="card" style={{ display: 'flex', gap: '1.25rem', padding: '1.25rem' }}>
                <img
                  src={item.book?.coverImage || 'https://via.placeholder.com/80x110?text=Book'}
                  alt={item.book?.title}
                  style={{ width: '80px', height: '110px', objectFit: 'cover', borderRadius: '6px' }}
                  onError={e => { e.target.src = 'https://via.placeholder.com/80x110?text=Book'; }}
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Link to={`/books/${item.book?._id}`}>
                    <h3 style={{ fontSize: '1.05rem', fontFamily: "'Playfair Display', serif" }}>{item.book?.title}</h3>
                  </Link>
                  <p style={{ fontSize: '0.88rem', color: '#8a7e70' }}>{item.book?.author}</p>
                  <p style={{ fontWeight: 700, color: '#1a1208' }}>₹{item.price} each</p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                    {/* Quantity Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e2d5c0', borderRadius: '8px', overflow: 'hidden' }}>
                      <button
                        onClick={() => updateItem(item._id, item.quantity - 1)}
                        style={{ padding: '0.4rem 0.75rem', border: 'none', background: '#f5ede0', cursor: 'pointer', fontWeight: 700 }}
                        disabled={loading}
                      >−</button>
                      <span style={{ padding: '0.4rem 1rem', fontWeight: 600 }}>{item.quantity}</span>
                      <button
                        onClick={() => updateItem(item._id, item.quantity + 1)}
                        style={{ padding: '0.4rem 0.75rem', border: 'none', background: '#f5ede0', cursor: 'pointer', fontWeight: 700 }}
                        disabled={loading}
                      >+</button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>₹{(item.price * item.quantity).toFixed(0)}</span>
                      <button
                        onClick={() => removeItem(item._id)}
                        style={{ background: 'none', border: 'none', color: '#b03020', cursor: 'pointer', fontSize: '1.1rem' }}
                        title="Remove"
                      >🗑</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '80px' }}>
            <h3 style={{ marginBottom: '1.25rem', fontFamily: "'Playfair Display', serif" }}>Order Summary</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#3d3020' }}>
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>₹{subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#3d3020' }}>
                <span>Shipping</span>
                <span style={{ color: shipping === 0 ? '#2d5a27' : '#1a1208' }}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              {shipping === 0 && (
                <p style={{ fontSize: '0.8rem', color: '#2d5a27', background: '#e8f5e2', padding: '0.4rem 0.75rem', borderRadius: '6px' }}>
                  🎉 You qualify for free shipping!
                </p>
              )}
              {shipping > 0 && (
                <p style={{ fontSize: '0.8rem', color: '#8a7e70' }}>
                  Add ₹{500 - subtotal} more for free shipping
                </p>
              )}
            </div>

            <div className="divider" />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 700 }}>
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <Link to="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              Proceed to Checkout →
            </Link>

            <Link to="/books" className="btn btn-ghost btn-sm" style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '0.75rem' }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
