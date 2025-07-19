import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../color/Registro.css";
import Navbar from "./Navbar.js";

export default function Registro() {
  const [hora, setHora] = useState(new Date().toLocaleTimeString());
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [color, setColor] = useState("green");
  const navigate = useNavigate();

  //by MAXXXX
  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  };

  const registrar = async () => {
    if (!username || !email || !password) {
      setColor("red");
      setMensaje("❌ Rellena todos los campos");
      return;
    }

    if (!isValidEmail(email)) {
      setColor("red");
      setMensaje("❌ Correo electrónico inválido");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      console.log("📦 Registro enviado:", { username, email, password });
      console.log("📥 Respuesta del servidor:", data);

      if (res.ok) {
        setColor("red");
        setMensaje("✅ Registrado correctamente. Redirigiendo...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setColor("red");
        setMensaje(`❌ ${data.error || "Error al registrar"}`);
      }
    } catch (err) {
      console.error("❌ Error al conectar:", err);
      setColor("red");
      setMensaje("❌ Error al conectar con el servidor");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      registrar();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setHora(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />

      <div className="registro-container">
        <h2>Crear cuenta</h2>
        <input
          className="registro-input"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          className="registro-input"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          className="registro-input"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={registrar} className="registro-button">
          Registrarse
        </button>

        <p className="registro-mensaje" style={{ color }}>
          {mensaje}
        </p>

        <div className="registro-link">
          <p>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </div>
      </div>

      <footer className="login-footer">
        <p>
          © {new Date().getFullYear()} Max | Lima, Perú. Todos los derechos reservados.
          <span className="footer-time">{hora}</span>
        </p>
      </footer>
    </>
  );
}
