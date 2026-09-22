import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";

export default function PersonalizedSection({
  title,
  subtitle,
  badge,
  products = [],
  viewAllLink = "/shop",
  testId
}) {
  if (!products || products.length === 0) return null;

  return (
    <section data-testid={testId} className="mx-auto max-w-[1400px] px-5 py-14 lg:px-10">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {badge && (
            <div className="mb-2.5 inline-flex items-center gap-1.5 border border-black/10 bg-secondary/80 px-2.5 py-1 text-[10px] font-500 uppercase tracking-widest text-muted-foreground">
              <Sparkles size={11} className="text-foreground" />
              {badge}
            </div>
          )}
          <h2 className="font-display text-3xl font-600 tracking-tight sm:text-4xl text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="inline-flex items-center gap-1 text-sm font-500 transition-colors hover:text-accent sm:self-end"
          >
            Explore all <ArrowRight size={14} />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-7">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
