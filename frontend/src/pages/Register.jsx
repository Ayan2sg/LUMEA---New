import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { apiError } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try { await register(name, email, password); navigate("/"); }
    catch (err) { setError(apiError(err.response?.data?.detail)); }
    finally { setLoading(false); }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-16 lg:order-1">
        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="w-full max-w-sm">
          <Link to="/" className="font-display text-2xl font-600 tracking-tighter lg:hidden">LUMÉA<span className="text-accent">.</span></Link>
          <h1 className="mt-6 font-display text-4xl font-600 tracking-tighter">Create Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Join Luméa. It takes a moment.</p>
          {error && <p data-testid="register-error" className="mt-4 border border-accent/30 bg-accent/5 p-3 text-sm text-accent">{error}</p>}
          <div className="mt-8 space-y-4">
            <Input data-testid="register-name" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-none" required />
            <Input data-testid="register-email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-none" required />
            <Input data-testid="register-password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-none" required />
          </div>
          <Button data-testid="register-submit" type="submit" disabled={loading} className="mt-6 w-full rounded-none bg-black py-6 hover:bg-accent">{loading ? "Creating…" : "Create Account"}</Button>
          <p className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <Link to="/login" className="font-500 text-black hover:text-accent">Sign in</Link></p>
        </motion.form>
      </div>
      <div className="relative hidden overflow-hidden bg-[#0a0a0a] lg:block">
        <img src="https://images.unsplash.com/photo-1717996563514-e3519f9ef9f7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBlbGVjdHJvbmljcyUyMGdhZGdldHN8ZW58MHx8fHwxNzg1ODc0MjYxfDA&ixlib=rb-4.1.0&q=85" alt="" className="h-full w-full object-cover opacity-80" />
        <p className="absolute bottom-10 left-10 max-w-sm font-display text-3xl font-500 leading-tight tracking-tight text-white">Objects for the considered life.</p>
      </div>
    </div>
  );
}
