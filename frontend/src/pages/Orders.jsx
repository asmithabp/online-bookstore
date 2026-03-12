import { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import api from '../utils/api';

const STATUS_COLORS = {
  Processing: 'badge-mist',
  Confirmed: 'badge-amber',
  Shipped: 'badge-amber',
  Delivered: 'badge-green',
  Cancelled: 'badge-red',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success');

  useEffect(() => {
    api.get('/orders/my-orders')
      .then(({ data }) => setOrders(data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div className="page-wrapper">
      <div className="container">
        {success && (
          <div style={{ background: '#e8f5e2', border: '1px solid #a8d4a0', borderRadius: '10px', padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem' }}>🎉</span>
            <div>
              <p style={{ fontWeight: 700, color: '#1a4a10' }}>Order Placed Successfully!</p>
              <p style={{ fontSize: '0.88rem', color: '#2d5a27' }}>Thank you for your purchase. Your order is being processed.</p>
            </div>
          </div>
        )}

        <h1 style={{ marginBottom: '2rem' }}>My Orders</h1>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <h3>No orders yet</h3>
            <p style={{ color: '#8a7e70', marginBottom: '1.5rem' }}>Start exploring books and place your first order!</p>
            <Link to="/books" className="btn btn-primary">Browse Books</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {orders.map(order => (
              <div key={order._id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#8a7e70', marginBottom: '0.25rem' }}>Order ID</p>
                    <p style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.9rem' }}>{order._id}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.8rem', color: '#8a7e70', marginBottom: '0.25rem' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <span className={`badge ${STATUS_COLORS[order.orderStatus] || 'badge-mist'}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {order.items.slice(0, 4).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f5ede0', borderRadius: '8px', padding: '0.5rem' }}>
                      <img
                        src={item.coverImage || 'https://via.placeholder.com/40x55'}
                        alt={item.title}
                        style={{ width: '35px', height: '48px', objectFit: 'cover', borderRadius: '4px' }}
                        onError={e => { e.target.src = 'https://via.placeholder.com/40x55'; }}
                      />
                      <div>
                        <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a1208' }}>{item.title}</p>
                        <p style={{ fontSize: '0.75rem', color: '#8a7e70' }}>Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 0.75rem', color: '#8a7e70', fontSize: '0.85rem' }}>
                      +{order.items.length - 4} more
                    </div>
                  )}
                </div>

                <div className="divider" style={{ margin: '0.75rem 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <div>
                      <p style={{ fontSize: '0.8rem', color: '#8a7e70' }}>Total Amount</p>
                      <p style={{ fontWeight: 700, fontSize: '1.05rem' }}>₹{order.totalAmount}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.8rem', color: '#8a7e70' }}>Payment</p>
                      <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>{order.paymentMethod} · <span style={{ color: order.paymentStatus === 'Paid' ? '#2d5a27' : '#8a7e70' }}>{order.paymentStatus}</span></p>
                    </div>
                  </div>
                  <Link to={`/orders/${order._id}`} className="btn btn-outline btn-sm">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
