import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const BookCard = ({ book }) => {
  const { addToCart, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(5 - full - (half ? 1 : 0));
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    addToCart(book);
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 p-2 flex flex-col">

      <Link
        to={`/books/${book._id || book.id}`}
        state={{ book }}
        style={{
          display: "block",
          position: "relative",
          overflow: "hidden",
          background: "#f0e8d8",
        }}
      >
        <img
          src={book.coverImage || "https://via.placeholder.com/200x280?text=No+Cover"}
          alt={book.title}
          style={{
            width: "100%",
            height: "240px",
            objectFit: "contain",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.04)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        />

        {discount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              background: "#2d5a27",
              color: "white",
              padding: "0.2rem 0.5rem",
              borderRadius: "5px",
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            -{discount}%
          </span>
        )}

        {book.stock === 0 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700,
              fontSize: "1.1rem",
            }}
          >
            Out of Stock
          </div>
        )}
      </Link>

      <div
        style={{
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.35rem",
          flex: 1,
        }}
      >
        <span
          style={{
            fontSize: "0.72rem",
            color: "#8a7e70",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontWeight: 600,
          }}
        >
          {book.category}
        </span>

        <Link to={`/books/${book._id || book.id}`} state={{ book }}>
          <h3
            style={{
              fontSize: "1rem",
              lineHeight: 1.3,
              color: "#1a1208",
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
            }}
          >
            {book.title}
          </h3>
        </Link>

        <p style={{ fontSize: "0.82rem", color: "#8a7e70" }}>{book.author}</p>

        {book.rating > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            <span className="stars" style={{ fontSize: "0.8rem" }}>
              {renderStars(book.rating)}
            </span>
            <span style={{ fontSize: "0.75rem", color: "#8a7e70" }}>
              ({book.numReviews})
            </span>
          </div>
        )}

        <div
          style={{
            marginTop: "auto",
            paddingTop: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span className="price price-current">₹{book.price}</span>

            {book.originalPrice && (
              <span className="price price-original">₹{book.originalPrice}</span>
            )}
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={handleAddToCart}
            disabled={loading || book.stock === 0}
            style={{
              fontSize: "0.8rem",
              padding: "0.35rem 0.8rem",
            }}
          >
            {book.stock === 0 ? "Sold Out" : "+ Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;