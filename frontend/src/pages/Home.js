import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import "../color/Home.css";

export default function Home() {
  const [hora, setHora] = useState(new Date().toLocaleTimeString());

  //by MAXXXX
  useEffect(() => {
    const interval = setInterval(() => {
      setHora(new Date().toLocaleTimeString());
    }, 1000); 

    return () => clearInterval(interval); 
  }, []);

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-content">
        <h1>¡Bienvenido a tu nuevo espacio de chat!</h1>
        <p>Conéctate con amigos y comparte mensajes de manera instantánea. Inicia sesión o regístrate para empezar.</p>
        <div className="home-buttons">
          <Link to="/login" className="home-button">Iniciar sesión</Link>
          <Link to="/registro" className="home-button">Registrarse</Link>
        </div>
      </div>
      <footer className="login-footer">
        <p>
          © {new Date().getFullYear()} Max | Lima, Perú. Todos los derechos reservados.
          <span className="footer-time">{hora}</span> 
        </p>
      </footer>
    </div>
  );
}
