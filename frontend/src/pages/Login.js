import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../color/Login.css";
import Navbar from "./Navbar.js";

export default function Login() {
  const [hora, setHora] = useState(new Date().toLocaleTimeString());
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [color, setColor] = useState("red");
  const navigate = useNavigate();

  //by MAXXXX
  const login = async () => {
    if (!username || !password) {
      setMensaje("❌ Debes completar todos los campos");
      setColor("red");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      console.log("📨 Login enviado:", { username, password });
      console.log(`🔐 Token usado en Chat: ${data.token}`);

      if (res.ok) {
        localStorage.setItem("usuario", username);
        localStorage.setItem("token", data.token);
        setColor("red");
        setMensaje("✅ Login exitoso. Redirigiendo al chat...");
        setTimeout(() => navigate("/chat"), 1500);
      } else {
        setMensaje(`❌ ${data.error || "Usuario no encontrado"}`);
        setColor("red");
      }
    } catch (err) {
      console.error("❌ Error de conexión:", err);
      setMensaje("❌ Error de conexión con el servidor");
      setColor("red");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      login();
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

      <div className="login-container">
        <h2>Iniciar sesión</h2>
        <input
          className="login-input"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
        /><br />
        <input
          className="login-input"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        /><br />
        <button onClick={login} className="login-button">Ingresar</button>
        <p className="login-message" style={{ color }}>{mensaje}</p>

        <div className="login-link">
          <p>
            ¿No tienes cuenta?{" "}
            <Link to="/registro" className="link-registro">Regístrate aquí</Link>
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
