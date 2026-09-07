import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Star, Minus, Plus, ShoppingBag, Truck, ShieldCheck, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import api, { mediaUrl, inr, apiError } from "@/lib/api";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  const [selSize, setSelSize] = useState("");
  const [selColor, setSelColor] = useState("");

  const load = () => api.get(`/products/${id}`).then((r) => setProduct(r.data));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); window.scrollTo(0, 0); setActiveImg(0); setSelSize(""); setSelColor(""); }, [id]);

  if (!product) return <div className="py-40 text-center font-display text-xl">Loading…</div>;
  const saved = inWishlist(product.id);
  const images = product.images?.length ? product.images : [""];
  const go = (dir) => setActiveImg((i) => (i + dir + images.length) % images.length);

  const variants = product.variants || [];
  const hasVariants = variants.length > 0;
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];
  const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))];
  const selectedVariant = hasVariants
    ? variants.find((v) => (!sizes.length || v.size === selSize) && (!colors.length || v.color === selColor))
    : null;
  const availStock = hasVariants ? (selectedVariant?.stock ?? 0) : product.stock;
  const needsSelection = hasVariants && ((sizes.length && !selSize) || (colors.length && !selColor));
  const colorSwatch = { Black: "#111", White: "#fff", Ivory: "#f2ede3", Sand: "#d8c5a5", Charcoal: "#3a3a3a", Rose: "#e11d48", Navy: "#1e293b", Olive: "#5b6236", Silver: "#c7ccd1", Graphite: "#4b4f56" };

  const addSelected = () => {
    if (needsSelection) { toast.error("Please select all options"); return; }
    addToCart(product.id, qty, hasVariants ? { size: selSize, color: selColor } : null);
  };

  const submitReview = async () => {
    if (!user) { navigate("/login"); return; }
    try {
      await api.post(`/products/${id}/reviews`, { rating, comment });
      setComment("");
      toast.success("Review posted");
      load();
    } catch (e) { toast.error(apiError(e.response?.data?.detail)); }
  };

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 lg:px-10">
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <motion.div key={activeImg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}
            className="grain group relative overflow-hidden bg-secondary" data-testid="gallery-main">
            <img src={mediaUrl(images[activeImg])} alt={product.name} className="aspect-[3/4] w-full object-cover" data-testid="product-image" />
            {images.length > 1 && (
              <>
                <button data-testid="gallery-prev" onClick={() => go(-1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-white/80 opacity-80 backdrop-blur transition-opacity hover:bg-black hover:text-white md:opacity-0 md:group-hover:opacity-100">
                  <ChevronLeft size={18} />
                </button>
                <button data-testid="gallery-next" onClick={() => go(1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-white/80 opacity-80 backdrop-blur transition-opacity hover:bg-black hover:text-white md:opacity-0 md:group-hover:opacity-100">
                  <ChevronRight size={18} />
                </button>
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {images.map((_, i) => (
                    <span key={i} className={`h-1.5 w-1.5 transition-colors ${i === activeImg ? "bg-black" : "bg-white/70"}`} />
                  ))}
                </div>
              </>
            )}
          </motion.div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto hide-scrollbar" data-testid="gallery-thumbs">
              {images.map((img, i) => (
                <button key={i} data-testid={`gallery-thumb-${i}`} onClick={() => setActiveImg(i)}
                  className={`h-24 w-20 shrink-0 overflow-hidden border transition-colors ${i === activeImg ? "border-black" : "border-transparent opacity-60 hover:opacity-100"}`}>
                  <img src={mediaUrl(img)} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{product.category}</p>
          <h1 className="mt-3 font-display text-4xl font-600 tracking-tighter sm:text-5xl" data-testid="product-name">{product.name}</h1>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-2xl font-500" data-testid="product-price">{inr(product.price)}</span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star size={14} fill="currentColor" className="text-black" /> {product.rating || "—"} ({product.review_count || 0})
            </span>
          </div>
          <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>

          {hasVariants && (
            <div className="mt-8 space-y-5" data-testid="variant-selectors">
              {sizes.length > 0 && (
                <div>
                  <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => (
                      <button key={s} data-testid={`size-${s}`} onClick={() => setSelSize(s)}
                        className={`min-w-[44px] border px-3 py-2 text-sm transition-colors ${selSize === s ? "border-black bg-black text-white" : "border-border hover:border-black"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {colors.length > 0 && (
                <div>
                  <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Color{selColor ? `: ${selColor}` : ""}</p>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c) => (
                      <button key={c} data-testid={`color-${c}`} onClick={() => setSelColor(c)} title={c}
                        className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors ${selColor === c ? "border-accent" : "border-border hover:border-black"}`}>
                        <span className="h-6 w-6 rounded-full border border-black/10" style={{ background: colorSwatch[c] || "#ccc" }} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 text-sm" data-testid="stock-status">
            {needsSelection
              ? <span className="text-muted-foreground">Select options to check availability</span>
              : availStock > 0
              ? <span className="text-green-700">In stock · {availStock} available</span>
              : <span className="text-accent">Out of stock</span>}
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-border">
              <button data-testid="qty-minus" onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 transition-colors hover:bg-secondary"><Minus size={15} /></button>
              <span className="w-10 text-center text-sm font-500" data-testid="qty-value">{qty}</span>
              <button data-testid="qty-plus" onClick={() => setQty((q) => q + 1)} className="p-3 transition-colors hover:bg-secondary"><Plus size={15} /></button>
            </div>
            <Button data-testid="add-to-cart-btn" disabled={!needsSelection && availStock <= 0}
              onClick={addSelected}
              className="flex-1 gap-2 rounded-none bg-black py-6 text-sm hover:bg-accent">
              <ShoppingBag size={16} /> Add to Bag
            </Button>
            <button data-testid="wishlist-detail-btn" onClick={() => toggleWishlist(product.id)}
              className="flex h-[52px] w-[52px] items-center justify-center border border-border transition-colors hover:bg-accent hover:text-white">
              <Heart size={18} fill={saved ? "currentColor" : "none"} className={saved ? "text-accent" : ""} />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 border-y border-border py-6 text-center text-xs">
            <div className="flex flex-col items-center gap-2"><Truck size={18} /> Free over ₹999</div>
            <div className="flex flex-col items-center gap-2"><ShieldCheck size={18} /> Secure payment</div>
            <div className="flex flex-col items-center gap-2"><RotateCcw size={18} /> 30-day returns</div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-24 grid gap-12 border-t border-border pt-12 lg:grid-cols-3">
        <div>
          <h2 className="font-display text-3xl font-600 tracking-tighter">Reviews</h2>
          <p className="mt-2 text-sm text-muted-foreground">{product.review_count || 0} verified reviews</p>
          {product.can_review ? (
            <div className="mt-8 border border-border p-6" data-testid="review-form">
              <p className="mb-3 text-sm font-500">Write a review</p>
              <div className="mb-3 flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} data-testid={`rate-${n}`} onClick={() => setRating(n)}>
                    <Star size={22} fill={n <= rating ? "currentColor" : "none"} className={n <= rating ? "text-black" : "text-muted-foreground"} />
                  </button>
                ))}
              </div>
              <Textarea data-testid="review-comment" value={comment} onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts…" className="rounded-none" />
              <Button data-testid="submit-review-btn" onClick={submitReview} className="mt-3 w-full rounded-none bg-black hover:bg-accent">Post Review</Button>
            </div>
          ) : (
            <div className="mt-8 border border-dashed border-border p-6 text-sm text-muted-foreground" data-testid="review-locked">
              {product.has_reviewed
                ? "You've already reviewed this product. Thank you!"
                : !user
                ? "Sign in and purchase this item to leave a review."
                : "Only verified buyers can review this product."}
            </div>
          )}
        </div>
        <div className="space-y-6 lg:col-span-2">
          {(product.reviews || []).length === 0 && <p className="text-muted-foreground">No reviews yet. Be the first.</p>}
          {(product.reviews || []).map((r) => (
            <div key={r.id} className="border-b border-border pb-6" data-testid={`review-${r.id}`}>
              <div className="flex items-center justify-between">
                <span className="font-500">{r.user_name}</span>
                <div className="flex gap-0.5">{Array(r.rating).fill(0).map((_, i) => <Star key={i} size={13} fill="currentColor" />)}</div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
