import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, User, Search, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount, wishlist } = useStore();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 lg:px-10">
        <Link to="/" data-testid="logo-link" className="font-display text-2xl font-600 tracking-tighter">
          LUMÉA<span className="text-accent">.</span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          <Link to="/shop" data-testid="nav-shop" className="text-sm font-500 transition-colors hover:text-accent">Shop All</Link>
          <Link to="/shop?category=Fashion" className="text-sm font-500 transition-colors hover:text-accent">Fashion</Link>
          <Link to="/shop?category=Electronics" className="text-sm font-500 transition-colors hover:text-accent">Electronics</Link>
          <Link to="/shop?category=Lifestyle" className="text-sm font-500 transition-colors hover:text-accent">Lifestyle</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button data-testid="search-btn" onClick={() => navigate("/shop")} className="hidden p-1 transition-colors hover:text-accent sm:block">
            <Search size={19} />
          </button>
          <Link to="/wishlist" data-testid="wishlist-link" className="relative p-1 transition-colors hover:text-accent">
            <Heart size={19} />
            {wishlist.length > 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center bg-accent text-[10px] font-700 text-white">{wishlist.length}</span>}
          </Link>
          <Link to="/cart" data-testid="cart-link" className="relative p-1 transition-colors hover:text-accent">
            <ShoppingBag size={19} />
            {cartCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center bg-accent text-[10px] font-700 text-white" data-testid="cart-count">{cartCount}</span>}
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button data-testid="user-menu" className="flex items-center gap-1.5 p-1 transition-colors hover:text-accent"><User size={19} /></button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-none">
                <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">{user.email}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/orders")} data-testid="menu-orders">My Orders</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/wishlist")}>Wishlist</DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem onClick={() => navigate("/admin")} data-testid="menu-admin">
                    <LayoutDashboard size={15} className="mr-2" /> Admin Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); navigate("/"); }} data-testid="logout-btn">
                  <LogOut size={15} className="mr-2" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login" data-testid="login-link" className="bg-black px-4 py-2 text-xs font-500 text-white transition-colors hover:bg-accent">Sign In</Link>
          )}
        </div>
      </div>
    </header>
  );
}
