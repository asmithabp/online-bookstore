import { useLocation } from "react-router-dom";

const BookDetail = () => {
  const location = useLocation();
  const book = location.state?.book;

  if (!book) {
    return <h2 style={{ padding: "40px" }}>Book not found</h2>;
  }

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      <div style={{ display: "flex", gap: "40px" }}>

        <img
          src={book.coverImage}
          alt={book.title}
          style={{ width: "220px", borderRadius: "8px" }}
        />

        <div>
          <h1>{book.title}</h1>

          <p><b>Author:</b> {book.author}</p>

          <p><b>Category:</b> {book.category}</p>

          <p><b>Rating:</b> ⭐ {book.rating}</p>

          <h2 style={{ marginTop: "20px" }}>₹{book.price}</h2>

          <p style={{ marginTop: "20px" }}>
            {book.description || "No description available."}
          </p>

        </div>

      </div>
    </div>
  );
};

export default BookDetail;