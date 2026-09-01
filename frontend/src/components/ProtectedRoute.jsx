import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children, admin }) {
  const { user, loading } = useAuth();
  if (loading)
    return <div className="flex h-screen items-center justify-center font-display text-xl">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}
