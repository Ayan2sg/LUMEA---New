import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Tag, Store, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const links = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Inventory", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/coupons", label: "Coupons", icon: Tag },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      <aside className="fixed flex h-screen w-60 flex-col bg-[#0a0a0a] text-[#f3f4f6]">
        <Link to="/admin" className="border-b border-white/10 p-6 font-display text-2xl font-600 tracking-tighter">LUMÉA<span className="text-accent">.</span><span className="ml-1 text-xs font-400 text-white/40">admin</span></Link>
        <nav className="flex-1 space-y-1 p-4">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} data-testid={`admin-nav-${label.toLowerCase()}`}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 text-sm transition-colors ${isActive ? "bg-[#1f2937] text-white" : "text-white/60 hover:bg-white/5 hover:text-white"}`}>
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <p className="mb-3 px-4 text-xs text-white/40">{user?.email}</p>
          <button onClick={() => navigate("/")} className="flex w-full items-center gap-3 px-4 py-2 text-sm text-white/60 transition-colors hover:text-white"><Store size={16} /> View Store</button>
          <button data-testid="admin-logout" onClick={() => { logout(); navigate("/"); }} className="flex w-full items-center gap-3 px-4 py-2 text-sm text-white/60 transition-colors hover:text-white"><LogOut size={16} /> Log out</button>
        </div>
      </aside>
      <main className="ml-60 flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
}
