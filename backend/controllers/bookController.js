const Book = require('../models/Book');
const path = require('path');
const fs = require('fs');

// @desc    Get all books with filtering, search, pagination
// @route   GET /api/books
// @access  Public
const getAllBooks = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

    const query = {};

    // Text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All') query.category = category;

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sort options
    let sortOption = '-createdAt';
    if (sort === 'price-asc') sortOption = 'price';
    if (sort === 'price-desc') sortOption = '-price';
    if (sort === 'rating') sortOption = '-rating';
    if (sort === 'title') sortOption = 'title';

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Book.countDocuments(query);
    const books = await Book.find(query).sort(sortOption).skip(skip).limit(Number(limit));

    res.json({
      success: true,
      count: books.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      books,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get featured books
// @route   GET /api/books/featured
// @access  Public
const getFeaturedBooks = async (req, res) => {
  try {
    const books = await Book.find({ isFeatured: true }).limit(8);
    res.json({ success: true, books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.json({ success: true, book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new book (admin)
// @route   POST /api/books
// @access  Admin
const createBook = async (req, res) => {
  try {
    const bookData = { ...req.body };

    // If image was uploaded, set the path
    if (req.file) {
      bookData.coverImage = `/uploads/${req.file.filename}`;
    }

    const book = await Book.create(bookData);
    res.status(201).json({ success: true, message: 'Book created successfully', book });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a book (admin)
// @route   PUT /api/books/:id
// @access  Admin
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const updateData = { ...req.body };

    // If new image uploaded, delete old one and set new path
    if (req.file) {
      if (book.coverImage && book.coverImage.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', book.coverImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.coverImage = `/uploads/${req.file.filename}`;
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, message: 'Book updated successfully', book: updatedBook });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a book (admin)
// @route   DELETE /api/books/:id
// @access  Admin
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Delete cover image if it's locally stored
    if (book.coverImage && book.coverImage.startsWith('/uploads/')) {
      const imgPath = path.join(__dirname, '..', book.coverImage);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await book.deleteOne();
    res.json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllBooks, getFeaturedBooks, getBookById, createBook, updateBook, deleteBook };
