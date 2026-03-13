import { useState, useEffect } from "react";
import BookCard from "../components/BookCard";
import { useLocation, useNavigate } from "react-router-dom";

const Books = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Read query from URL
  const params = new URLSearchParams(location.search);
  const query = params.get("search") || "programming";

  const [books, setBooks] = useState([]);
  const [searchInput, setSearchInput] = useState(query);
  const [loading, setLoading] = useState(false);

  // Fetch books from OpenLibrary
  const fetchBooks = async (q) => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch books");
      }

      const data = await res.json();

      if (!data.docs || data.docs.length === 0) {
        setBooks([]);
        return;
      }

      const formattedBooks = data.docs.slice(0, 20).map((doc, index) => ({
        _id: doc.key || index,
        title: doc.title || "Unknown Title",
        author: doc.author_name?.join(", ") || "Unknown Author",
        coverImage: doc.cover_i
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
          : "https://via.placeholder.com/200x280?text=No+Cover",
        price: Math.floor(Math.random() * 400) + 200,
        rating: 4,
        numReviews: 10,
      }));

      setBooks(formattedBooks);
    } catch (error) {
      console.error("BOOK FETCH ERROR:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // Run when query changes
  useEffect(() => {
    fetchBooks(query);
    setSearchInput(query);
  }, [query]);

  // Search submit
  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchInput.trim()) return;

    navigate(`/books?search=${encodeURIComponent(searchInput)}`);
  };

  return (
    <div className="container" style={{ padding: "40px" }}>
      <h1>Browse Books</h1>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        style={{ display: "flex", gap: "10px", margin: "20px 0" }}
      >
        <input
          type="text"
          placeholder="Search books..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{
            padding: "10px",
            flex: 1,
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "10px 18px",
            background: "#c8820a",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </form>

      {/* Books List */}
      {loading ? (
        <p>Loading books...</p>
      ) : books.length === 0 ? (
        <p>No books found</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Books;