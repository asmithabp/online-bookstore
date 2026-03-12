const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

const User = require('../models/User');
const Book = require('../models/Book');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/online-bookstore';

const books = [
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    description: 'A magical story about Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure. His quest will lead him to riches far different — and far more satisfying — than he ever imagined.',
    price: 299,
    originalPrice: 399,
    category: 'Fiction',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg',
    isbn: '9780062315007',
    publisher: 'HarperOne',
    publishedYear: 1988,
    pages: 197,
    stock: 50,
    rating: 4.7,
    numReviews: 1250,
    isFeatured: true,
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving — every day. James Clear reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
    price: 549,
    originalPrice: 699,
    category: 'Self-Help',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
    isbn: '9780735211292',
    publisher: 'Avery',
    publishedYear: 2018,
    pages: 320,
    stock: 75,
    rating: 4.8,
    numReviews: 2100,
    isFeatured: true,
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    description: 'From a renowned historian comes a groundbreaking narrative of humanity\'s creation and evolution — a #1 international bestseller — that explores the ways in which biology and history have defined us and enhanced our understanding of what it means to be "human."',
    price: 499,
    originalPrice: 599,
    category: 'History',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780062316110-L.jpg',
    isbn: '9780062316110',
    publisher: 'Harper Perennial',
    publishedYear: 2015,
    pages: 443,
    stock: 40,
    rating: 4.6,
    numReviews: 1800,
    isFeatured: true,
  },
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    description: 'Timeless lessons on wealth, greed, and happiness. Doing well with money isn\'t necessarily about what you know. It\'s about how you behave. And behavior is hard to teach, even to really smart people.',
    price: 449,
    originalPrice: 499,
    category: 'Self-Help',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg',
    isbn: '9780857197689',
    publisher: 'Harriman House',
    publishedYear: 2020,
    pages: 256,
    stock: 60,
    rating: 4.7,
    numReviews: 950,
    isFeatured: true,
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    description: 'A handbook of agile software craftsmanship. Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees. This book is packed with practical advice about what makes bad code and how to transform it.',
    price: 899,
    originalPrice: 1099,
    category: 'Technology',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg',
    isbn: '9780132350884',
    publisher: 'Prentice Hall',
    publishedYear: 2008,
    pages: 464,
    stock: 30,
    rating: 4.5,
    numReviews: 780,
    isFeatured: false,
  },
  {
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    description: 'Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his horrible aunt and uncle.',
    price: 350,
    originalPrice: 450,
    category: 'Fiction',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780439708180-L.jpg',
    isbn: '9780439708180',
    publisher: 'Scholastic',
    publishedYear: 1997,
    pages: 309,
    stock: 100,
    rating: 4.9,
    numReviews: 5200,
    isFeatured: true,
  },
  {
    title: 'Wings of Fire',
    author: 'A.P.J. Abdul Kalam',
    description: 'An autobiography of one of India\'s most beloved presidents and scientists. The inspiring story of Dr. A.P.J. Abdul Kalam — from humble origins to the peak of scientific achievement and national leadership.',
    price: 250,
    originalPrice: 299,
    category: 'Biography',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9788173711466-L.jpg',
    isbn: '9788173711466',
    publisher: 'Universities Press',
    publishedYear: 1999,
    pages: 196,
    stock: 85,
    rating: 4.8,
    numReviews: 3100,
    isFeatured: true,
  },
  {
    title: 'Rich Dad Poor Dad',
    author: 'Robert T. Kiyosaki',
    description: 'What the rich teach their kids about money that the poor and middle class do not! This personal finance classic has challenged and changed the way tens of millions of people around the world think about money.',
    price: 349,
    originalPrice: 399,
    category: 'Self-Help',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg',
    isbn: '9781612680194',
    publisher: 'Plata Publishing',
    publishedYear: 2017,
    pages: 336,
    stock: 70,
    rating: 4.5,
    numReviews: 2400,
    isFeatured: false,
  },
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    description: 'Richard Dawkins\' brilliant reformulation of the theory of natural selection has the rare distinction of having provoked as much excitement and interest outside the scientific community as within it.',
    price: 499,
    originalPrice: 599,
    category: 'Science',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780198788607-L.jpg',
    isbn: '9780198788607',
    publisher: 'Oxford University Press',
    publishedYear: 2016,
    pages: 544,
    stock: 25,
    rating: 4.4,
    numReviews: 560,
    isFeatured: false,
  },
  {
    title: 'The Da Vinci Code',
    author: 'Dan Brown',
    description: 'A murder inside the Louvre and clues in Da Vinci paintings lead to the discovery of a religious mystery protected by a secret society for two thousand years — which could shake the foundations of Christianity.',
    price: 299,
    originalPrice: 349,
    category: 'Mystery',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780307474278-L.jpg',
    isbn: '9780307474278',
    publisher: 'Anchor',
    publishedYear: 2006,
    pages: 597,
    stock: 45,
    rating: 4.3,
    numReviews: 4100,
    isFeatured: false,
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    description: 'A groundbreaking tour of the mind, exploring the two systems that drive the way we think: System 1 is fast, intuitive, and emotional; System 2 is slower, more deliberative, and more logical.',
    price: 599,
    originalPrice: 699,
    category: 'Non-Fiction',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg',
    isbn: '9780374533557',
    publisher: 'Farrar, Straus and Giroux',
    publishedYear: 2013,
    pages: 499,
    stock: 35,
    rating: 4.6,
    numReviews: 1100,
    isFeatured: true,
  },
  {
    title: 'The Lean Startup',
    author: 'Eric Ries',
    description: 'Most startups fail. But many of those failures are preventable. The Lean Startup is a new approach being adopted across the globe, changing the way companies are built and new products are launched.',
    price: 499,
    originalPrice: 599,
    category: 'Technology',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780307887894-L.jpg',
    isbn: '9780307887894',
    publisher: 'Crown Business',
    publishedYear: 2011,
    pages: 336,
    stock: 40,
    rating: 4.4,
    numReviews: 890,
    isFeatured: false,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    await User.create({
      name: 'Admin User',
      email: 'admin@bookstore.com',
      password: adminPassword,
      role: 'admin',
    });

    // Create test user
    const userPassword = await bcrypt.hash('user123', 12);
    await User.create({
      name: 'Test User',
      email: 'user@bookstore.com',
      password: userPassword,
      role: 'user',
    });

    console.log('👤 Created admin and test users');

    // Insert books
    await Book.insertMany(books);
    console.log(`📚 Inserted ${books.length} books`);

    console.log('\n✅ Seed complete!');
    console.log('Admin: admin@bookstore.com / admin123');
    console.log('User:  user@bookstore.com / user123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
