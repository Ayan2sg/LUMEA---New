import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    if (authLoading) return;
    if (!user) {
      setCart([]);
      setWishlist([]);
      setLoaded(true);
      return;
    }
    try {
      const [c, w] = await Promise.all([api.get("/cart"), api.get("/wishlist")]);
      setCart(c.data);
      setWishlist(w.data);
    } catch (e) {
      /* ignore */
    } finally {
      setLoaded(true);
    }
  }, [user, authLoading]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addToCart = async (productId, quantity = 1, variant = null) => {
    if (!user) {
      toast.error("Please sign in to add items");
      return false;
    }
    const { data } = await api.post("/cart", { product_id: productId, quantity, variant });
    setCart(data);
    toast.success("Added to bag");
    return true;
  };

  const updateCart = async (productId, quantity, variant = null) => {
    const { data } = await api.put("/cart", { product_id: productId, quantity, variant });
    setCart(data);
  };

  const removeFromCart = async (productId, variant = null) => {
    const qs = variant
      ? `?size=${encodeURIComponent(variant.size || "")}&color=${encodeURIComponent(variant.color || "")}`
      : "";
    const { data } = await api.delete(`/cart/${productId}${qs}`);
    setCart(data);
  };

  const toggleWishlist = async (productId) => {
    if (!user) {
      toast.error("Please sign in to save items");
      return;
    }
    await api.post(`/wishlist/${productId}`);
    await refresh();
  };

  const inWishlist = (id) => wishlist.some((p) => p.id === id);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <StoreContext.Provider
      value={{ cart, wishlist, loaded, refresh, addToCart, updateCart, removeFromCart,
        toggleWishlist, inWishlist, cartCount, subtotal }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
