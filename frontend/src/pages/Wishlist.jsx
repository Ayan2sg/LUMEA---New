import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ProductCard";

export default function Wishlist() {
  const { wishlist } = useStore();

  if (wishlist.length === 0)
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-32 text-center lg:px-10" data-testid="wishlist-empty">
        <Heart size={40} className="mx-auto text-muted-foreground" />
        <h1 className="mt-6 font-display text-3xl font-600 tracking-tighter">Your wishlist is empty</h1>
        <Link to="/shop" className="mt-6 inline-block bg-black px-6 py-3 text-sm text-white hover:bg-accent">Discover products</Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 lg:px-10">
      <h1 className="mb-10 font-display text-4xl font-600 tracking-tighter sm:text-5xl">Wishlist</h1>
      <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8" data-testid="wishlist-grid">
        {wishlist.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </div>
  );
}
