
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

  // FETCH GOOGLE BOOKS
  useEffect(() => {
    fetch("https://www.googleapis.com/books/v1/volumes?q=programming&maxResults=20")
      .then((res) => res.json())
      .then((data) => {
        const books =
          data.items?.map((item, index) => ({
            _id: item.id || index,
            title: item.volumeInfo.title || "Unknown Title",
            author: item.volumeInfo.authors?.join(", ") || "Unknown Author",
            category: item.volumeInfo.categories?.[0] || "General",
            coverImage:
              item.volumeInfo.imageLinks?.thumbnail ||
              "https://via.placeholder.com/200x280?text=No+Cover",
            price: Math.floor(Math.random() * 500) + 200,
            originalPrice: Math.floor(Math.random() * 600) + 500,
            rating: item.volumeInfo.averageRating || 4,
            numReviews: item.volumeInfo.ratingsCount || 10,
            stock: 10,
          })) || [];

        setFeatured(books);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/books?search=${encodeURIComponent(search.trim())}`);
    }
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

          <p
            style={{
              color: "#c8820a",
              fontSize: "0.9rem",
              letterSpacing: "0.15em",
              marginBottom: "1rem",
            }}
          >
            ✦ India's Favourite Bookstore ✦
          </p>

          <h1 style={{ fontFamily: "Playfair Display", marginBottom: "1rem" }}>
            Every Book Is a <br />
            <em style={{ color: "#e8a020" }}>New Journey</em>
          </h1>

          <p
            style={{
              maxWidth: "520px",
              margin: "0 auto 2rem",
              color: "#c4b090",
            }}
          >
            Discover thousands of books across all genres delivered to your
            doorstep across India.
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
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
            }}
          >
            <input
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                padding: "0.9rem 1.5rem",
                color: "#1a1208",              // FIX: visible text
                fontSize: "0.95rem"
              }}
            />

            <button
              type="submit"
              style={{
                background: "#c8820a",
                color: "white",
                border: "none",
                padding: "0.9rem 1.5rem",
                cursor: "pointer",
                fontWeight: "500"
              }}
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* CATEGORIES */}
      <section
        style={{
          padding: "3rem 0",
          background: "#fdf8f0",
          borderBottom: "1px solid #e2d5c0",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/books?category=${cat}`}
                style={{
                  padding: "0.5rem 1.25rem",
                  borderRadius: "50px",
                  border: "1px solid #e2d5c0",
                  background: "white",
                  color: "#3d3020",
                  fontSize: "0.9rem",
                }}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED BOOKS */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container">

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "2rem",
            }}
          >
            <h2>Featured Books</h2>
            <Link to="/books">View All →</Link>
          </div>

          {loading ? (
            <div style={{ textAlign: "center" }}>Loading...</div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {featured.map((book, index) => (
                <BookCard key={index} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          background: "linear-gradient(135deg,#2d5a27,#1a3a16)",
          padding: "4rem 0",
          textAlign: "center",
        }}
      >
        <div className="container">
          <h2 style={{ color: "white", marginBottom: "1rem" }}>
            Free Shipping on Orders Above ₹500
          </h2>

          <p style={{ color: "#a8d4a0", marginBottom: "1.5rem" }}>
            Order today and get your books delivered in 2-5 days anywhere in
            India.
          </p>

          <Link
            to="/books"
            style={{
              background: "#e8a020",
              padding: "0.8rem 1.6rem",
              borderRadius: "6px",
              color: "white",
            }}
          >
            Shop Now →
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;

