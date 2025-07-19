import React from "react";
import { Link, useLocation } from "react-router-dom"; 
import "../color/Navbar.css"; 

export default function Navbar() {
  const location = useLocation();  

  if (location.pathname === "/") {
    return null;  
  }

  return (
    <div className="navbar">
      <div className="navbar-links">
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/login" className="navbar-link">Iniciar sesión</Link>
        <Link to="/registro" className="navbar-link">Registrarse</Link>
      </div>
    </div>
  );
}
