import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { apiError } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const u = await login(email, password);
      navigate(u.role === "admin" ? "/admin" : "/");
    } catch (err) { setError(apiError(err.response?.data?.detail)); }
    finally { setLoading(false); }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-[#0a0a0a] lg:block">
        <img src="https://images.pexels.com/photos/30590675/pexels-photo-30590675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="" className="h-full w-full object-cover opacity-80" />
        <Link to="/" className="absolute left-10 top-10 font-display text-2xl font-600 tracking-tighter text-white">LUMÉA<span className="text-accent">.</span></Link>
        <p className="absolute bottom-10 left-10 max-w-sm font-display text-3xl font-500 leading-tight tracking-tight text-white">Welcome back to the edit.</p>
      </div>
      <div className="flex items-center justify-center px-6 py-16">
        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="w-full max-w-sm">
          <Link to="/" className="font-display text-2xl font-600 tracking-tighter lg:hidden">LUMÉA<span className="text-accent">.</span></Link>
          <h1 className="mt-6 font-display text-4xl font-600 tracking-tighter">Sign In</h1>
          <p className="mt-2 text-sm text-muted-foreground">Access your bag, orders & wishlist.</p>
          {error && <p data-testid="login-error" className="mt-4 border border-accent/30 bg-accent/5 p-3 text-sm text-accent">{error}</p>}
          <div className="mt-8 space-y-4">
            <Input data-testid="login-email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-none" required />
            <Input data-testid="login-password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-none" required />
          </div>
          <Button data-testid="login-submit" type="submit" disabled={loading} className="mt-6 w-full rounded-none bg-black py-6 hover:bg-accent">{loading ? "Signing in…" : "Sign In"}</Button>
          <p className="mt-6 text-center text-sm text-muted-foreground">New here? <Link to="/register" className="font-500 text-black hover:text-accent">Create an account</Link></p>
        </motion.form>
      </div>
    </div>
  );
}
