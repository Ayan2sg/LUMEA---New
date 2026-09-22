import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Sparkles, ShoppingBag } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ProductCard from "@/components/ProductCard";
import PersonalizedSection from "@/components/PersonalizedSection";

export default function Home() {
  const { user } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [recData, setRecData] = useState(null);
  const [loadingRecs, setLoadingRecs] = useState(true);

  useEffect(() => {
    // 1. Fetch featured pieces
    api.get("/products", { params: { featured: true } })
      .then((r) => setFeatured(r.data.slice(0, 8)))
      .catch(() => {});

    // 2. Fetch personalized recommendations
    const guestId = localStorage.getItem("lumea_guest_id") || "guest_" + Math.random().toString(36).substring(2, 9);
    localStorage.setItem("lumea_guest_id", guestId);

    api.get("/recommendations/personalized", { params: { guest_id: guestId } })
      .then((r) => setRecData(r.data))
      .catch(() => {})
      .finally(() => setLoadingRecs(false));
  }, [user]);

  const userName = user?.name ? user.name.trim().split(/\s+/)[0] : recData?.user?.firstName || null;

  return (
    <div className="space-y-4">
      {/* HERO — Tetris asymmetric grid */}
      <section className="mx-auto max-w-[1400px] px-5 pb-6 pt-8 lg:px-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="grain relative col-span-1 overflow-hidden bg-secondary md:col-span-8"
          >
            <img
              src="https://images.pexels.com/photos/30590675/pexels-photo-30590675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              alt="Featured"
              className="h-[420px] w-full object-cover md:h-[640px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 text-white md:p-12">
              <p className="mb-3 text-xs uppercase tracking-[0.3em]">Spring Editorial · 2026</p>
              <h1 className="font-display text-4xl font-600 leading-[0.95] tracking-tighter sm:text-5xl lg:text-6xl">
                Objects for
                <br />
                the considered life.
              </h1>
              <Link
                to="/shop"
                data-testid="hero-shop-btn"
                className="mt-6 inline-flex items-center gap-2 bg-white px-6 py-3 text-sm font-500 text-black transition-colors hover:bg-accent hover:text-white"
              >
                Explore the collection <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

          <div className="col-span-1 flex flex-col gap-4 md:col-span-4">
            <Link to="/shop?category=Fashion" className="group relative flex-1 overflow-hidden bg-[#0e0e0e]">
              <img
                src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?crop=entropy&cs=srgb&fm=jpg&q=85&w=940"
                alt="Fashion"
                className="h-[210px] w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105 md:h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 flex w-full items-center justify-between p-6 text-white">
                <span className="font-display text-2xl font-500 tracking-tight">Fashion</span>
                <ArrowUpRight />
              </div>
            </Link>
            <Link to="/shop?category=Footwear" className="group relative flex-1 overflow-hidden bg-secondary">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=srgb&fm=jpg&q=85&w=940"
                alt="Footwear"
                className="h-[210px] w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 flex w-full items-center justify-between p-6 text-white">
                <span className="font-display text-2xl font-500 tracking-tight">Footwear</span>
                <ArrowUpRight />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Personalized Welcome Bar (when user is logged in) */}
      {user && (
        <section data-testid="personalized-welcome-banner" className="mx-auto max-w-[1400px] px-5 lg:px-10">
          <div className="flex flex-col justify-between gap-4 border border-border bg-card p-6 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-2xl font-600 tracking-tight sm:text-3xl">
                  Welcome back, {userName} 👋
                </h2>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Your homepage is dynamically personalized across browsing history, wishlist, and past orders.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 border border-border bg-secondary/70 px-3 py-1.5 text-xs font-500 text-foreground">
                <Sparkles size={12} className="text-accent" />
                Personalized Curation Active
              </span>
              <Link
                to="/shop"
                className="inline-flex items-center gap-1 bg-black px-3.5 py-1.5 text-xs font-500 text-white transition-opacity hover:opacity-90"
              >
                <ShoppingBag size={13} />
                Browse All
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 1. "Because you viewed [Product]" section */}
      {recData?.becauseYouViewed && recData.becauseYouViewed.items?.length > 0 && (
        <PersonalizedSection
          testId="section-because-viewed"
          title={`Because you viewed ${recData.becauseYouViewed.baseProduct.name}`}
          subtitle={`Similar pieces and accessories curated around ${recData.becauseYouViewed.baseProduct.category}`}
          badge="Browsing History"
          products={recData.becauseYouViewed.items}
          viewAllLink={`/shop?category=${encodeURIComponent(recData.becauseYouViewed.baseProduct.category)}`}
        />
      )}

      {/* 2. "Recommended for you" multi-factor personalized section */}
      {recData?.recommendedForYou && recData.recommendedForYou.length > 0 && (
        <PersonalizedSection
          testId="section-recommended-for-you"
          title="Recommended For You"
          subtitle="Selected based on your browsing pattern, category affinities, and price preferences"
          badge="AI Recommendation"
          products={recData.recommendedForYou}
          viewAllLink="/shop"
        />
      )}

      {/* 3. "Based on your Wishlist" */}
      {recData?.basedOnWishlist && recData.basedOnWishlist.length > 0 && (
        <PersonalizedSection
          testId="section-wishlist-matches"
          title="Based on Your Wishlist"
          subtitle="Curated styles matching the items you have saved"
          badge="Wishlist Inspiration"
          products={recData.basedOnWishlist}
          viewAllLink="/wishlist"
        />
      )}

      {/* 4. "Recently Viewed" */}
      {recData?.recentlyViewed && recData.recentlyViewed.length > 0 && (
        <PersonalizedSection
          testId="section-recently-viewed"
          title="Recently Viewed"
          subtitle="Quickly return to items you inspected"
          badge="Recent History"
          products={recData.recentlyViewed}
          viewAllLink="/shop"
        />
      )}

      {/* Marquee strip */}
      <div className="overflow-hidden border-y border-border bg-black py-3 text-white">
        <div className="flex gap-12 whitespace-nowrap text-xs uppercase tracking-[0.25em]">
          {Array(2).fill(0).map((_, i) => (
            <div key={i} className="flex gap-12">
              <span>Free shipping over ₹999</span><span>·</span><span>Editorial curation</span><span>·</span>
              <span>Secure Razorpay checkout</span><span>·</span><span>30-day returns</span><span>·</span>
              <span>AI Personal Shopping Assistant</span><span>·</span><span>New drops weekly</span><span>·</span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured / Trending Pieces */}
      <section className="mx-auto max-w-[1400px] px-5 py-16 lg:px-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">The Edit</p>
            <h2 className="font-display text-4xl font-600 tracking-tighter sm:text-5xl">Featured Pieces</h2>
          </div>
          <Link to="/shop" className="hidden items-center gap-1 text-sm font-500 hover:text-accent sm:flex">
            View all <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
          {(featured.length > 0 ? featured : recData?.trending || []).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
