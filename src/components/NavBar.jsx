import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function NavBar() {
  const { isAuthed, role, user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold">Payroll</Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {isAuthed && role === "ADMIN" && (
              <li className="nav-item"><NavLink to="/admin" className="nav-link">Admin</NavLink></li>
            )}
            {isAuthed && role === "EMPLOYEE" && (
              <li className="nav-item"><NavLink to="/me" className="nav-link">Employee</NavLink></li>
            )}
          </ul>
          <ul className="navbar-nav">
            {!isAuthed && <>
              <li className="nav-item"><NavLink to="/login" className="nav-link">Login</NavLink></li>
              <li className="nav-item"><NavLink to="/register" className="nav-link">Register</NavLink></li>
            </>}
            {isAuthed && <>
              <li className="nav-item text-secondary nav-link">Hi, {user?.username} ({role})</li>
              <li className="nav-item">
                <button className="btn btn-sm btn-outline-dark ms-2" onClick={logout}>Logout</button>
              </li>
            </>}
          </ul>
        </div>
      </div>
    </nav>
  );
}
