import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [], totalAmount: 0 });
      return;
    }

    try {
      const { data } = await api.get("/cart");
      setCart(data.cart || { items: [], totalAmount: 0 });
    } catch {
      console.log("Cart fetch failed");
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (book) => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    setLoading(true);

    try {
      const bookId = book._id || book.id;

      const { data } = await api.post("/cart", {
        bookId,
        title: book.title,
        price: book.price,
        coverImage: book.coverImage,
        quantity: 1,
      });

      setCart(data.cart);
      toast.success("Added to cart!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      const { data } = await api.put(`/cart/${itemId}`, { quantity });
      setCart(data.cart);
    } catch {
      toast.error("Failed to update cart");
    }
  };

  const removeItem = async (itemId) => {
    try {
      const { data } = await api.delete(`/cart/${itemId}`);
      setCart(data.cart);
      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const clearCart = async () => {
    try {
      const { data } = await api.delete("/cart/clear");
      setCart(data.cart);
    } catch {}
  };

  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateItem,
        removeItem,
        clearCart,
        loading,
        itemCount,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};