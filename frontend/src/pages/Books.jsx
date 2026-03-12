import { useState, useEffect } from "react";
import BookCard from "../components/BookCard";
import { useLocation, useNavigate } from "react-router-dom";

const Books = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const query = params.get("search") || "programming";

  const [books, setBooks] = useState([]);
  const [searchInput, setSearchInput] = useState(query);
  const [loading, setLoading] = useState(true);

  const categories = [
    "programming",
    "fiction",
    "non fiction",
    "science",
    "history",
    "business",
  ];

  const fetchBooks = (searchQuery) => {
    setLoading(true);

    fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&maxResults=30`
    )
      .then((res) => res.json())
      .then((data) => {
        const formatted =
          data.items?.map((item, index) => ({
            _id: item.id || index,
            title: item.volumeInfo.title || "Unknown Title",
            author: item.volumeInfo.authors?.join(", ") || "Unknown Author",
            category: item.volumeInfo.categories?.[0] || "General",
            description: item.volumeInfo.description || "No description",
            coverImage:
              item.volumeInfo.imageLinks?.thumbnail ||
              "https://via.placeholder.com/200x280?text=No+Cover",
            price: Math.floor(Math.random() * 500) + 200,
            rating: item.volumeInfo.averageRating || 4,
            numReviews: item.volumeInfo.ratingsCount || 10,
            stock: 10,
          })) || [];

        setBooks(formatted);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooks(query);
    setSearchInput(query);
    window.scrollTo(0, 0);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchInput.trim() !== "") {
      navigate(`/books?search=${searchInput}`);
    }
  };

  const handleCategory = (category) => {
    navigate(`/books?search=${category}`);
  };

  return (
    <div className="container" style={{ padding: "40px 0" }}>
      <h1>Browse Books</h1>

      {/* SEARCH BAR */}
      <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          gap: "10px",
          margin: "20px 0",
        }}
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
            padding: "10px 20px",
            background: "#c8820a",
            color: "white",
            border: "none",
            borderRadius: "6px",
          }}
        >
          Search
        </button>
      </form>

      {/* CATEGORY FILTER */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            style={{
              padding: "8px 14px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              background: "#f5f5f5",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* BOOK GRID */}
      {loading ? (
        <p>Loading books...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
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