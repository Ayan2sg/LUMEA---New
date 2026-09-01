import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get("/products", { params: { featured: true } }).then((r) => setFeatured(r.data.slice(0, 8)));
  }, []);

  return (
    <div>
      {/* HERO — Tetris asymmetric grid */}
      <section className="mx-auto max-w-[1400px] px-5 pb-10 pt-8 lg:px-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
            className="grain relative col-span-1 overflow-hidden bg-secondary md:col-span-8"
          >
            <img src="https://images.pexels.com/photos/30590675/pexels-photo-30590675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              alt="Featured" className="h-[420px] w-full object-cover md:h-[640px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 text-white md:p-12">
              <p className="mb-3 text-xs uppercase tracking-[0.3em]">Spring Editorial · 2026</p>
              <h1 className="font-display text-4xl font-600 leading-[0.95] tracking-tighter sm:text-5xl lg:text-6xl">Objects for<br />the considered life.</h1>
              <Link to="/shop" data-testid="hero-shop-btn" className="mt-6 inline-flex items-center gap-2 bg-white px-6 py-3 text-sm font-500 text-black transition-colors hover:bg-accent hover:text-white">
                Explore the collection <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

          <div className="col-span-1 flex flex-col gap-4 md:col-span-4">
            <Link to="/shop?category=Electronics" className="group relative flex-1 overflow-hidden bg-secondary">
              <img src="https://images.unsplash.com/photo-1717996563514-e3519f9ef9f7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBlbGVjdHJvbmljcyUyMGdhZGdldHN8ZW58MHx8fHwxNzg1ODc0MjYxfDA&ixlib=rb-4.1.0&q=85"
                alt="Electronics" className="h-[210px] w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-full" />
              <div className="absolute bottom-0 left-0 flex w-full items-center justify-between p-6 text-white">
                <span className="font-display text-2xl font-500 tracking-tight">Electronics</span>
                <ArrowUpRight />
              </div>
            </Link>
            <Link to="/shop?category=Lifestyle" className="group relative flex-1 overflow-hidden bg-[#0a0a0a]">
              <img src="https://images.unsplash.com/photo-1605629921852-f9b3d997c14a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2ODh8MHwxfHNlYXJjaHw0fHxlY29tbWVyY2UlMjBsaWZlc3R5bGUlMjBwcm9kdWN0c3xlbnwwfHx8fDE3ODU4NzQyNjF8MA&ixlib=rb-4.1.0&q=85"
                alt="Lifestyle" className="h-[210px] w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105 md:h-full" />
              <div className="absolute bottom-0 left-0 flex w-full items-center justify-between p-6 text-white">
                <span className="font-display text-2xl font-500 tracking-tight">Lifestyle</span>
                <ArrowUpRight />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* marquee strip */}
      <div className="overflow-hidden border-y border-border bg-black py-3 text-white">
        <div className="flex gap-12 whitespace-nowrap text-xs uppercase tracking-[0.25em]">
          {Array(2).fill(0).map((_, i) => (
            <div key={i} className="flex gap-12">
              <span>Free shipping over ₹999</span><span>·</span><span>Editorial curation</span><span>·</span>
              <span>Secure Razorpay checkout</span><span>·</span><span>30-day returns</span><span>·</span>
              <span>New drops weekly</span><span>·</span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured products */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">The Edit</p>
            <h2 className="font-display text-4xl font-600 tracking-tighter sm:text-5xl">Featured Pieces</h2>
          </div>
          <Link to="/shop" className="hidden items-center gap-1 text-sm font-500 hover:text-accent sm:flex">View all <ArrowRight size={15} /></Link>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
          {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>
    </div>
  );
}
