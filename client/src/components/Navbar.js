import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">📋 Team Task Manager</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/tasks">Tasks</Link></li>
      </ul>
      <div className="navbar-user">
        <span className="user-badge">{user.role}</span>
        <span>{user.name}</span>
        <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
