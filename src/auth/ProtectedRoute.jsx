import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function ProtectedRoute({ allowed = [] }) {
  const { isAuthed, role } = useAuth();

  if (!isAuthed) return <Navigate to="/login" replace />;

  if (allowed.length && !allowed.includes(role)) {
    // If they’re logged in but on the wrong area, bounce them to their home
    return role === "ADMIN"
      ? <Navigate to="/admin" replace />
      : <Navigate to="/me" replace />;
  }

  return <Outlet />;
}
