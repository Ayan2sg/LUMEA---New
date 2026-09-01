import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { mediaUrl, inr } from "@/lib/api";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";

export default function Cart() {
  const { cart, updateCart, removeFromCart, subtotal } = useStore();
  const navigate = useNavigate();
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 49;

  if (cart.length === 0)
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-32 text-center lg:px-10">
        <ShoppingBag size={40} className="mx-auto text-muted-foreground" />
        <h1 className="mt-6 font-display text-3xl font-600 tracking-tighter">Your bag is empty</h1>
        <Link to="/shop" data-testid="empty-cart-shop" className="mt-6 inline-flex items-center gap-2 bg-black px-6 py-3 text-sm text-white transition-colors hover:bg-accent">Start shopping <ArrowRight size={15} /></Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 lg:px-10">
      <h1 className="mb-10 font-display text-4xl font-600 tracking-tighter sm:text-5xl">Your Bag</h1>
      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {cart.map(({ product, quantity, variant }) => {
            const vkey = variant ? `${variant.size || ""}-${variant.color || ""}` : "";
            const vlabel = variant ? [variant.size, variant.color].filter(Boolean).join(" · ") : "";
            return (
            <div key={`${product.id}-${vkey}`} className="flex gap-5 border-b border-border py-6" data-testid={`cart-item-${product.id}${vkey ? "-" + vkey : ""}`}>
              <img src={mediaUrl(product.images?.[0])} alt={product.name} className="h-32 w-24 shrink-0 object-cover" />
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{product.category}</p>
                    <Link to={`/product/${product.id}`} className="font-display text-lg font-500 tracking-tight hover:text-accent">{product.name}</Link>
                    {vlabel && <p className="mt-0.5 text-xs text-muted-foreground" data-testid={`cart-variant-${product.id}`}>{vlabel}</p>}
                  </div>
                  <button data-testid={`remove-${product.id}`} onClick={() => removeFromCart(product.id, variant)} className="text-muted-foreground transition-colors hover:text-accent"><Trash2 size={17} /></button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-border">
                    <button data-testid={`cart-qty-minus-${product.id}`} onClick={() => updateCart(product.id, quantity - 1, variant)} className="p-2 hover:bg-secondary"><Minus size={14} /></button>
                    <span className="w-9 text-center text-sm" data-testid={`cart-qty-${product.id}`}>{quantity}</span>
                    <button data-testid={`cart-qty-plus-${product.id}`} onClick={() => updateCart(product.id, quantity + 1, variant)} className="p-2 hover:bg-secondary"><Plus size={14} /></button>
                  </div>
                  <span className="font-500">{inr(product.price * quantity)}</span>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        <div className="h-fit border border-border p-8 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-600 tracking-tight">Order Summary</h2>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span data-testid="cart-subtotal">{inr(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : inr(shipping)}</span></div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-600"><span>Total</span><span>{inr(subtotal + shipping)}</span></div>
          </div>
          <Button data-testid="checkout-btn" onClick={() => navigate("/checkout")} className="mt-6 w-full gap-2 rounded-none bg-black py-6 hover:bg-accent">Checkout <ArrowRight size={16} /></Button>
        </div>
      </div>
    </div>
  );
}
