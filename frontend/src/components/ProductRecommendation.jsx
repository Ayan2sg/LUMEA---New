import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingBag, Check } from "lucide-react";
import { mediaUrl, inr } from "@/lib/api";
import { useStore } from "@/context/StoreContext";

export default function ProductRecommendation({ product, onAction }) {
  const { addToCart } = useStore();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (adding || added) return;
    setAdding(true);
    const success = await addToCart(product.id, 1, product.variants?.[0] || null);
    setAdding(false);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
      if (onAction) onAction(product);
    }
  };

  const imageSrc = mediaUrl(product.images?.[0]);

  return (
    <div
      data-testid={`ai-rec-card-${product.id}`}
      className="group flex flex-col overflow-hidden border border-border bg-card transition-all hover:border-black/30 hover:shadow-sm"
    >
      <Link to={`/product/${product.id}`} className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No Image
          </div>
        )}
        {product.rating && (
          <span className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/80 px-2 py-0.5 text-[10px] font-500 text-white backdrop-blur">
            <Star size={10} fill="currentColor" />
            {product.rating}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between p-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{product.category}</p>
          <Link to={`/product/${product.id}`} className="block">
            <h4 className="mt-0.5 line-clamp-1 font-display text-sm font-500 transition-colors hover:text-accent">
              {product.name}
            </h4>
          </Link>
          <p className="mt-1 font-display text-sm font-600 text-foreground">{inr(product.price)}</p>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Link
            to={`/product/${product.id}`}
            className="flex-1 border border-black/20 bg-transparent py-1.5 text-center text-xs font-500 transition-colors hover:bg-black hover:text-white"
          >
            View
          </Link>
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={adding || product.stock <= 0}
            data-testid={`ai-add-cart-${product.id}`}
            className="flex h-8 w-8 shrink-0 items-center justify-center bg-black text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            title="Add to Bag"
          >
            {added ? <Check size={14} /> : <ShoppingBag size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
