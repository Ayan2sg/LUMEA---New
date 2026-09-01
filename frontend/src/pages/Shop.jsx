import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const category = params.get("category") || "all";
  const sort = params.get("sort") || "newest";

  useEffect(() => {
    api.get("/categories").then((r) => setCategories(r.data));
  }, []);

  const load = useCallback(() => {
    api.get("/products", { params: { category, sort, search: search || undefined } })
      .then((r) => setProducts(r.data));
  }, [category, sort, search]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const setParam = (k, v) => {
    const p = new URLSearchParams(params);
    if (v === "all") p.delete(k); else p.set(k, v);
    setParams(p);
  };

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 lg:px-10">
      <div className="mb-4 border-b border-border pb-8">
        <h1 className="font-display text-4xl font-600 tracking-tighter sm:text-5xl">
          {category === "all" ? "Shop All" : category}
        </h1>
        <p className="mt-2 text-muted-foreground">{products.length} pieces available</p>
      </div>

      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input data-testid="search-input" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…" className="rounded-none pl-9" />
        </div>
        <div className="flex gap-3">
          <Select value={category} onValueChange={(v) => setParam("category", v)}>
            <SelectTrigger className="w-40 rounded-none" data-testid="category-filter"><SelectValue /></SelectTrigger>
            <SelectContent className="rounded-none">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setParam("sort", v)}>
            <SelectTrigger className="w-40 rounded-none" data-testid="sort-filter"><SelectValue /></SelectTrigger>
            <SelectContent className="rounded-none">
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="py-24 text-center text-muted-foreground">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
          {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
