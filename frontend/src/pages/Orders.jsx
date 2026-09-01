import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Check, Truck, Clock, X } from "lucide-react";
import api, { mediaUrl, inr } from "@/lib/api";

const STAGES = ["pending", "confirmed", "shipped", "delivered"];
const ICONS = { pending: Clock, confirmed: Check, shipped: Truck, delivered: Package };

function Tracker({ status }) {
  if (status === "cancelled")
    return <div className="mt-4 flex items-center gap-2 text-sm text-accent"><X size={16} /> Order cancelled</div>;
  const idx = STAGES.indexOf(status);
  return (
    <div className="mt-6 flex items-center">
      {STAGES.map((s, i) => {
        const Icon = ICONS[s];
        const done = i <= idx;
        const current = i === idx;
        return (
          <div key={s} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`flex h-9 w-9 items-center justify-center border transition-colors ${current ? "border-accent bg-accent text-white ring-4 ring-accent/15" : done ? "border-black bg-black text-white" : "border-border text-muted-foreground"}`}>
                <Icon size={16} />
              </div>
              <span className={`mt-2 text-[10px] uppercase tracking-wider ${current ? "font-700 text-accent" : done ? "text-black" : "text-muted-foreground"}`}>{s}</span>
            </div>
            {i < STAGES.length - 1 && <div className={`mx-2 h-px flex-1 ${i < idx ? "bg-black" : "bg-border"}`} />}
          </div>
        );
      })}
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { api.get("/orders").then((r) => setOrders(r.data)); }, []);

  if (orders.length === 0)
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-32 text-center lg:px-10">
        <Package size={40} className="mx-auto text-muted-foreground" />
        <h1 className="mt-6 font-display text-3xl font-600 tracking-tighter">No orders yet</h1>
        <Link to="/shop" className="mt-6 inline-block bg-black px-6 py-3 text-sm text-white hover:bg-accent">Start shopping</Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-12 lg:px-10">
      <h1 className="mb-10 font-display text-4xl font-600 tracking-tighter sm:text-5xl">My Orders</h1>
      <div className="space-y-8">
        {orders.map((o) => (
          <div key={o.id} className="border border-border p-8" data-testid={`order-${o.id}`}>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Order #{o.id.slice(-8)}</p>
                <p className="mt-1 text-sm">{new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-xl font-600">{inr(o.total)}</p>
                <p className={`text-xs uppercase tracking-wider ${o.payment_status === "paid" ? "text-green-700" : "text-muted-foreground"}`}>{o.payment_status}</p>
              </div>
            </div>
            <Tracker status={o.status} />
            <div className="mt-6 space-y-3">
              {o.items.map((it, i) => (
                <div key={i} className="flex items-center gap-4">
                  {it.image && <img src={mediaUrl(it.image)} alt={it.name} className="h-14 w-11 object-cover" />}
                  <div className="flex-1">
                    <p className="text-sm font-500">{it.name}</p>
                    {it.variant && <p className="text-xs text-muted-foreground">{[it.variant.size, it.variant.color].filter(Boolean).join(" · ")}</p>}
                    <p className="text-xs text-muted-foreground">Qty {it.quantity}</p>
                  </div>
                  <span className="text-sm">{inr(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
