export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-[#0a0a0a] text-white">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-16 md:grid-cols-4 lg:px-10">
        <div>
          <div className="font-display text-3xl font-600 tracking-tighter">LUMÉA<span className="text-accent">.</span></div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">Editorial commerce. Curated fashion, electronics & lifestyle objects for the considered life.</p>
        </div>
        <div>
          <h4 className="mb-4 text-xs uppercase tracking-widest text-white/40">Shop</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>Fashion</li><li>Electronics</li><li>Lifestyle</li><li>New Arrivals</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-xs uppercase tracking-widest text-white/40">Support</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>Order Tracking</li><li>Shipping</li><li>Returns</li><li>Contact</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-xs uppercase tracking-widest text-white/40">Newsletter</h4>
          <p className="text-sm text-white/50">Join for early drops.</p>
          <div className="mt-3 flex">
            <input className="w-full border border-white/20 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-white/30" placeholder="Email address" />
            <button className="bg-accent px-4 text-sm font-500">→</button>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/30">© 2026 Luméa. All rights reserved.</div>
    </footer>
  );
}
