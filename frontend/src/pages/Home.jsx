import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";

const CATEGORIES = [
  "Fiction",
  "Non-Fiction",
  "Science",
  "History",
  "Biography",
  "Technology",
  "Self-Help",
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // FETCH BOOKS FROM OPENLIBRARY
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(
          "https://openlibrary.org/search.json?q=programming&limit=20"
        );

        const data = await res.json();

        const books =
          data.docs?.slice(0, 12).map((doc, index) => ({
            _id: doc.key || index,
            title: doc.title || "Unknown Title",
            author: doc.author_name?.join(", ") || "Unknown Author",
            category: doc.subject?.[0] || "General",
            coverImage: doc.cover_i
              ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
              : "https://via.placeholder.com/200x280?text=No+Cover",
            price: Math.floor(Math.random() * 400) + 200,
            originalPrice: Math.floor(Math.random() * 600) + 500,
            rating: 4,
            numReviews: 10,
            stock: 10,
          })) || [];

        setFeatured(books);
      } catch (error) {
        console.log("BOOK FETCH ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // SEARCH
  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    navigate(`/books?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div>

      {/* HERO */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #1a1208 0%, #3d2800 60%, #1a1208 100%)",
          color: "white",
          padding: "5rem 0",
          textAlign: "center",
        }}
      >
        <div className="container">

          <h1 style={{ marginBottom: "1rem" }}>
            📚 Welcome to Online Bookstore
          </h1>

          <p style={{ marginBottom: "2rem", color: "#c4b090" }}>
            Discover thousands of books across all genres
          </p>

          {/* SEARCH */}
          <form
            onSubmit={handleSearch}
            style={{
              display: "flex",
              maxWidth: "520px",
              margin: "0 auto",
              background: "white",
              borderRadius: "50px",
              overflow: "hidden",
            }}
          >
            <input
              type="text"
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                padding: "12px 20px",
                color: "#000",
              }}
            />

            <button
              type="submit"
              style={{
                background: "#c8820a",
                color: "white",
                border: "none",
                padding: "12px 20px",
                cursor: "pointer",
              }}
            >
              Search
            </button>
          </form>

        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: "40px 0", textAlign: "center" }}>
        <div className="container">

          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/books?search=${cat}`}
              style={{
                margin: "5px",
                padding: "8px 16px",
                border: "1px solid #ddd",
                borderRadius: "20px",
                display: "inline-block",
                textDecoration: "none",
                color: "#333",
              }}
            >
              {cat}
            </Link>
          ))}

        </div>
      </section>

      {/* FEATURED BOOKS */}
      <section style={{ padding: "40px 0" }}>
        <div className="container">

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <h2>Featured Books</h2>
            <Link to="/books">View All</Link>
          </div>

          {loading ? (
            <p style={{ textAlign: "center" }}>Loading books...</p>
          ) : featured.length === 0 ? (
            <p style={{ textAlign: "center" }}>No books available</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                gap: "20px",
              }}
            >
              {featured.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}

        </div>
      </section>

    </div>
  );
};

export default Home;