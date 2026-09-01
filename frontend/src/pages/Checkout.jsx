import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useRazorpay } from "react-razorpay";
import { Tag, Check } from "lucide-react";
import api, { inr, apiError } from "@/lib/api";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Checkout() {
  const { cart, subtotal, refresh, loaded } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { Razorpay } = useRazorpay();
  const [addr, setAddr] = useState({ name: user?.name || "", phone: "", line1: "", city: "", state: "", pincode: "" });
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const placedRef = useRef(false);

  useEffect(() => {
    if (loaded && !placedRef.current && cart.length === 0) navigate("/cart");
  }, [cart, loaded, navigate]);

  const shipping = subtotal > 999 ? 0 : 49;
  const discount = coupon ? Math.round((subtotal * coupon.discount_percent) / 100) : 0;
  const total = subtotal - discount + shipping;

  const applyCoupon = async () => {
    try {
      const { data } = await api.post(`/coupons/validate?code=${encodeURIComponent(couponCode)}&amount=${subtotal}`);
      setCoupon(data);
      toast.success(`${data.discount_percent}% off applied`);
    } catch (e) { setCoupon(null); toast.error(apiError(e.response?.data?.detail)); }
  };

  const placeOrder = async () => {
    if (!addr.name || !addr.line1 || !addr.city || !addr.pincode) { toast.error("Please complete your address"); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/checkout", { coupon_code: coupon?.code || null, address: addr });
      if (data.demo_mode || !data.razorpay_order) {
        await api.post("/orders/verify", { order_id: data.order_id });
        placedRef.current = true;
        await refresh();
        toast.success("Order placed (demo payment)");
        navigate("/orders");
        return;
      }
      const rzp = new Razorpay({
        key: data.razorpay_key_id,
        amount: data.razorpay_order.amount,
        currency: "INR",
        name: "Luméa",
        description: "Order payment",
        order_id: data.razorpay_order.id,
        prefill: { name: addr.name, email: user.email, contact: addr.phone },
        theme: { color: "#e11d48" },
        handler: async (res) => {
          await api.post("/orders/verify", {
            order_id: data.order_id,
            razorpay_payment_id: res.razorpay_payment_id,
            razorpay_order_id: res.razorpay_order_id,
            razorpay_signature: res.razorpay_signature,
          });
          placedRef.current = true;
          await refresh();
          toast.success("Payment successful");
          navigate("/orders");
        },
      });
      rzp.open();
    } catch (e) { toast.error(apiError(e.response?.data?.detail)); }
    finally { setLoading(false); }
  };

  if (cart.length === 0) return null;

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 lg:px-10">
      <h1 className="mb-10 font-display text-4xl font-600 tracking-tighter sm:text-5xl">Checkout</h1>
      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-display text-xl font-600 tracking-tight">Shipping Address</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Input data-testid="addr-name" placeholder="Full name" value={addr.name} onChange={(e) => setAddr({ ...addr, name: e.target.value })} className="rounded-none" />
            <Input data-testid="addr-phone" placeholder="Phone" value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} className="rounded-none" />
            <Input data-testid="addr-line1" placeholder="Address" value={addr.line1} onChange={(e) => setAddr({ ...addr, line1: e.target.value })} className="rounded-none sm:col-span-2" />
            <Input data-testid="addr-city" placeholder="City" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} className="rounded-none" />
            <Input data-testid="addr-state" placeholder="State" value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value })} className="rounded-none" />
            <Input data-testid="addr-pincode" placeholder="Pincode" value={addr.pincode} onChange={(e) => setAddr({ ...addr, pincode: e.target.value })} className="rounded-none" />
          </div>
        </div>

        <div className="h-fit border border-border p-8 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-600 tracking-tight">Summary</h2>
          <div className="mt-4 flex">
            <div className="relative flex-1">
              <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input data-testid="coupon-input" placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="rounded-none pl-9" />
            </div>
            <Button data-testid="apply-coupon-btn" onClick={applyCoupon} variant="outline" className="rounded-none border-l-0">Apply</Button>
          </div>
          {coupon && <p className="mt-2 flex items-center gap-1 text-xs text-green-700"><Check size={13} /> {coupon.code} · {coupon.discount_percent}% off</p>}
          <p className="mt-2 text-xs text-muted-foreground">Try WELCOME10 or SAVE20</p>

          <div className="mt-6 space-y-3 border-t border-border pt-4 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{inr(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-700"><span>Discount</span><span>-{inr(discount)}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : inr(shipping)}</span></div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-600"><span>Total</span><span data-testid="checkout-total">{inr(total)}</span></div>
          </div>
          <Button data-testid="place-order-btn" onClick={placeOrder} disabled={loading} className="mt-6 w-full rounded-none bg-black py-6 hover:bg-accent">
            {loading ? "Processing…" : `Pay ${inr(total)}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
