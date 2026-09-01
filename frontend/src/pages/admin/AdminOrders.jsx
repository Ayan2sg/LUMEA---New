import { useEffect, useState } from "react";
import api, { inr } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
const badge = { pending: "bg-amber-100 text-amber-700", confirmed: "bg-blue-100 text-blue-700", shipped: "bg-indigo-100 text-indigo-700", delivered: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700" };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const load = () => api.get("/admin/orders").then((r) => setOrders(r.data));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/admin/orders/${id}/status?status=${status}`);
    toast.success("Status updated"); load();
  };

  return (
    <div>
      <h1 className="font-display text-4xl font-600 tracking-tighter">Orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">{orders.length} total orders</p>

      <div className="mt-8 space-y-4">
        {orders.length === 0 && <p className="text-muted-foreground">No orders yet.</p>}
        {orders.map((o) => (
          <div key={o.id} className="border border-black/10 bg-white p-6" data-testid={`admin-order-${o.id}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-display text-lg font-600">#{o.id.slice(-8)}</p>
                <p className="text-sm text-muted-foreground">{o.user_name} · {o.user_email}</p>
                <p className="mt-1 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString("en-IN")}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-[10px] uppercase tracking-wider ${badge[o.status] || "bg-gray-100"}`}>{o.status}</span>
                <span className={`text-xs ${o.payment_status === "paid" ? "text-green-700" : "text-muted-foreground"}`}>{o.payment_status}</span>
                <span className="font-display text-xl font-600">{inr(o.total)}</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
              <div className="text-sm text-muted-foreground">
                {o.items.map((it) => `${it.name}${it.variant ? ` [${[it.variant.size, it.variant.color].filter(Boolean).join("/")}]` : ""} ×${it.quantity}`).join(", ")}
                {o.coupon && <span className="ml-2 text-green-700">· {o.coupon}</span>}
              </div>
              <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v)}>
                <SelectTrigger className="w-40 rounded-none" data-testid={`status-select-${o.id}`}><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-none">
                  {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Ship to: {o.address?.name}, {o.address?.line1}, {o.address?.city} {o.address?.pincode}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
