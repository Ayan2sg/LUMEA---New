import { useEffect, useState } from "react";
import { TrendingUp, ShoppingCart, Package, Users, AlertTriangle, Flame } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid } from "recharts";
import api, { inr, mediaUrl } from "@/lib/api";

const COLORS = ["#111827", "#6366f1", "#10b981", "#f59e0b", "#e11d48"];

const Stat = ({ icon: Icon, label, value, testid }) => (
  <div className="border border-black/10 bg-white p-6" data-testid={testid}>
    <div className="flex items-center justify-between">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <Icon size={18} className="text-muted-foreground" />
    </div>
    <p className="mt-3 font-display text-3xl font-600 tracking-tight">{value}</p>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get("/admin/stats").then((r) => setStats(r.data)); }, []);
  if (!stats) return <p className="font-display text-xl">Loading…</p>;

  return (
    <div>
      <h1 className="font-display text-4xl font-600 tracking-tighter">Overview</h1>
      <p className="mt-1 text-sm text-muted-foreground">Store performance at a glance</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={TrendingUp} label="Revenue" value={inr(stats.revenue)} testid="stat-revenue" />
        <Stat icon={ShoppingCart} label="Orders" value={stats.total_orders} testid="stat-orders" />
        <Stat icon={Package} label="Products" value={stats.total_products} testid="stat-products" />
        <Stat icon={Users} label="Customers" value={stats.total_customers} testid="stat-customers" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="border border-black/10 bg-white p-6 lg:col-span-2" data-testid="daily-revenue-chart">
          <h2 className="mb-6 text-sm font-600 uppercase tracking-widest">Revenue — Last 14 Days</h2>
          {(stats.daily_revenue || []).every((d) => d.revenue === 0) ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No revenue in the last 14 days yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={stats.daily_revenue}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e11d48" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#e11d48" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} interval={1} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => inr(v)} cursor={{ stroke: "#e11d48" }} />
                <Area type="monotone" dataKey="revenue" stroke="#e11d48" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="border border-black/10 bg-white p-6" data-testid="best-sellers">
          <h2 className="mb-6 flex items-center gap-2 text-sm font-600 uppercase tracking-widest"><Flame size={15} className="text-accent" /> Best Sellers</h2>
          {(stats.best_sellers || []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No sales yet.</p>
          ) : (
            <div className="space-y-4">
              {stats.best_sellers.map((b, i) => (
                <div key={i} className="flex items-center gap-3" data-testid={`best-seller-${i}`}>
                  <span className="font-display text-lg font-600 text-muted-foreground">{i + 1}</span>
                  {b.image && <img src={mediaUrl(b.image)} alt="" className="h-11 w-9 object-cover" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-500">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.qty} sold · {inr(b.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="border border-black/10 bg-white p-6 lg:col-span-2">
          <h2 className="mb-6 text-sm font-600 uppercase tracking-widest">Revenue by Category</h2>
          {stats.category_revenue.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No sales data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.category_revenue}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => inr(v)} cursor={{ fill: "#f3f4f6" }} />
                <Bar dataKey="value" fill="#111827" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="border border-black/10 bg-white p-6">
          <h2 className="mb-6 text-sm font-600 uppercase tracking-widest">Category Split</h2>
          {stats.category_revenue.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={stats.category_revenue} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>
                  {stats.category_revenue.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => inr(v)} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="border border-black/10 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-600 uppercase tracking-widest"><AlertTriangle size={15} className="text-amber-500" /> Low Stock Alert</h2>
          {stats.low_stock.length === 0 ? <p className="text-sm text-muted-foreground">All products well stocked.</p> : (
            <div className="space-y-2">
              {stats.low_stock.map((p) => (
                <div key={p.id} className="flex items-center justify-between border-b border-border py-2 text-sm">
                  <span>{p.name}</span>
                  <span className={`font-500 ${p.stock === 0 ? "text-accent" : "text-amber-600"}`}>{p.stock} left</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border border-black/10 bg-white p-6">
          <h2 className="mb-4 text-sm font-600 uppercase tracking-widest">Recent Orders</h2>
          {stats.recent_orders.length === 0 ? <p className="text-sm text-muted-foreground">No orders yet.</p> : (
            <div className="space-y-2">
              {stats.recent_orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between border-b border-border py-2 text-sm">
                  <div><span className="font-500">#{o.id.slice(-6)}</span> <span className="text-muted-foreground">· {o.user_name}</span></div>
                  <span className="font-500">{inr(o.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
