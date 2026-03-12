import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    paymentMethod: 'COD'
  });

  const items = cart?.items || [];
  const subtotal = cart?.totalAmount || 0;
  const shipping = subtotal >= 500 ? 0 : 49;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center' }}>
        <h2>Your cart is empty</h2>
        <Link to="/books" className="btn btn-primary">Browse Books</Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const { paymentMethod, ...address } = form;

    setLoading(true);

    try {
      const { data } = await api.post('/orders', {
        shippingAddress: address,
        paymentMethod
      });

      await clearCart();

      toast.success('Order placed successfully!');
      navigate(`/orders/${data.order._id}?success=1`);

    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">

        <h1 style={{ marginBottom: '2rem' }}>Checkout</h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 360px',
          gap: '2rem'
        }}>

          {/* LEFT */}
          <div>

            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3>Shipping Address</h3>

              <input
                className="input"
                placeholder="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
              />

              <input
                className="input"
                placeholder="Street Address"
                name="street"
                value={form.street}
                onChange={handleChange}
              />

              <input
                className="input"
                placeholder="City"
                name="city"
                value={form.city}
                onChange={handleChange}
              />

              <input
                className="input"
                placeholder="State"
                name="state"
                value={form.state}
                onChange={handleChange}
              />

              <input
                className="input"
                placeholder="Pincode"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
              />

              <input
                className="input"
                placeholder="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />

            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <h3>Payment Method</h3>

              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={form.paymentMethod === 'COD'}
                  onChange={handleChange}
                />
                Cash on Delivery
              </label>

              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Online"
                  checked={form.paymentMethod === 'Online'}
                  onChange={handleChange}
                />
                Online Payment
              </label>

            </div>

          </div>

          {/* RIGHT */}
          <div className="card" style={{ padding: '1.5rem' }}>

            <h3>Order Summary</h3>

            {items.map(item => (
              <div key={item._id} style={{
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>{item.book?.title} × {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}

            <hr />

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>

            <hr />

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 'bold'
            }}>
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '20px' }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Placing Order...' : `Place Order ₹${total}`}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Checkout;