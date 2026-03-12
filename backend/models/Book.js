const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number, // For showing discounts
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Technology', 'Self-Help', 'Children', 'Romance', 'Mystery'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    isbn: {
      type: String,
      unique: true,
      sparse: true,
    },
    publisher: String,
    publishedYear: Number,
    pages: Number,
    language: {
      type: String,
      default: 'English',
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for search
bookSchema.index({ title: 'text', author: 'text', description: 'text' });

module.exports = mongoose.model('Book', bookSchema);
