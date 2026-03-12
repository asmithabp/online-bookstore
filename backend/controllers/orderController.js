const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Book = require('../models/Book');

// @desc    Create new order from cart
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Shipping address and payment method are required' });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.book');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Build order items and verify stock
    const orderItems = [];
    for (const item of cart.items) {
      const book = await Book.findById(item.book._id);
      if (!book || book.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${item.book.title}"`,
        });
      }
      // Decrease stock
      book.stock -= item.quantity;
      await book.save();

      orderItems.push({
        book: item.book._id,
        title: item.book.title,
        coverImage: item.book.coverImage,
        quantity: item.quantity,
        price: item.price,
      });
    }

    const subtotal = cart.totalAmount;
    const shippingCharge = subtotal >= 500 ? 0 : 49; // Free shipping above ₹500
    const totalAmount = subtotal + shippingCharge;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCharge,
      totalAmount,
    });

    // Clear the cart after order
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json({ success: true, message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.book', 'title coverImage')
      .sort('-createdAt');
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    // Allow access to own order or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort('-createdAt');
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    await order.save();
    res.json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
