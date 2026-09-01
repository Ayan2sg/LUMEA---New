import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Star } from "lucide-react";
import { mediaUrl, inr } from "@/lib/api";
import { useStore } from "@/context/StoreContext";

export default function ProductCard({ product, index = 0 }) {
  const { toggleWishlist, inWishlist } = useStore();
  const saved = inWishlist(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
      className="group relative"
      data-testid={`product-card-${product.id}`}
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
          <img
            src={mediaUrl(product.images?.[0])}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {product.stock <= 0 && (
            <span className="absolute left-3 top-3 bg-black px-2 py-1 text-[10px] uppercase tracking-wider text-white">Sold Out</span>
          )}
          {product.featured && product.stock > 0 && (
            <span className="absolute left-3 top-3 bg-accent px-2 py-1 text-[10px] uppercase tracking-wider text-white">Featured</span>
          )}
        </div>
      </Link>
      <button
        data-testid={`wishlist-toggle-${product.id}`}
        onClick={() => toggleWishlist(product.id)}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-white/80 backdrop-blur transition-colors hover:bg-accent hover:text-white"
      >
        <Heart size={16} fill={saved ? "currentColor" : "none"} className={saved ? "text-accent" : ""} />
      </button>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{product.category}</p>
          <Link to={`/product/${product.id}`}>
            <h3 className="mt-1 font-display text-lg font-500 leading-tight tracking-tight transition-colors group-hover:text-accent">{product.name}</h3>
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
          <Star size={12} fill="currentColor" className="text-black" /> {product.rating || "—"}
        </div>
      </div>
      <p className="mt-1 font-500">{inr(product.price)}</p>
    </motion.div>
  );
}
