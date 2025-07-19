import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Picker from "emoji-picker-react";
import "../color/Chat.css";

export default function Chat() {
  const [hora, setHora] = useState(new Date().toLocaleTimeString());
  const [mensajes, setMensajes] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [estado, setEstado] = useState(null);
  const [estaActivo, setEstaActivo] = useState(false);
  const [usuariosConectados, setUsuariosConectados] = useState([]);
  const [mostrarEmojis, setMostrarEmojis] = useState(false);
  const [modoOscuro, setModoOscuro] = useState(false);
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const mensajesRef = useRef(null);

  const usuario = localStorage.getItem("usuario");
  const token = localStorage.getItem("token");
  const sonidoRef = useRef(new Audio("/sonido.mp3"));

  //by MAXXXX
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!usuario || !token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:8080/mensajes", {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Token inválido");
        return res.json();
      })
      .then((data) => {
        setMensajes(data || []);
      })
      .catch((err) => {
        console.error("❌ Error al cargar historial:", err);
        setEstado({ texto: "⚠️ Token inválido o sesión expirada", tipo: "error" });
        setTimeout(() => navigate("/login"), 2000);
      });

    socketRef.current = new WebSocket("ws://localhost:8080/ws");

    socketRef.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "status") {
        setEstado({ texto: msg.message, tipo: msg.status });

        if (msg.status === "success" && msg.message.includes("conectado")) {
          if (Notification.permission === "granted") {
            new Notification("👤 Usuario conectado", { body: msg.message });
          }
        }

        setTimeout(() => setEstado(null), 3000);
        return;
      }

      if (msg.type === "usuarios") {
        setUsuariosConectados(msg.usuarios || []);
        return;
      }

      sonidoRef.current.play().catch(() => { });
      setMensajes((prev) => [...prev, msg]);
    };

    socketRef.current.onopen = () => setEstaActivo(true);
    socketRef.current.onclose = () => console.log("💤 WebSocket cerrado");

    return () => socketRef.current?.close();
  }, [usuario, token, navigate]);

  useEffect(() => {
    if (mensajesRef.current) {
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight;
    }
  }, [mensajes]);

  const enviarMensaje = () => {
    if (!mensaje.trim()) return;
    socketRef.current.send(JSON.stringify({ username: usuario, content: mensaje }));
    setMensaje("");
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const agregarEmoji = (emoji) => {
    setMensaje((prev) => prev + emoji.emoji);
    setMostrarEmojis(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setHora(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`chat-container ${modoOscuro ? "oscuro" : ""}`}>
      <div className="chat-header">
        <div className="chat-title">
          {estaActivo && <span className="punto-verde" title="Conectado"></span>}
          <h2>Chat en tiempo real</h2>
        </div>
        <div className="chat-controls-top">
          <button onClick={() => setModoOscuro(!modoOscuro)} className="chat-button">
            {modoOscuro ? "☀️ Claro" : "🌙 Oscuro"}
          </button>
          <button onClick={cerrarSesion} className="chat-button logout">Cerrar sesión</button>
        </div>
      </div>

      <div className="chat-usuario-conectado">
        Estás conectado como: <strong>{usuario}</strong>
      </div>

      <div className="chat-controls">
        <input
          placeholder="Escribe tu mensaje..."
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
          className="chat-input"
        />

        <div className="emoji-container">
          <button onClick={() => setMostrarEmojis(!mostrarEmojis)} className="emoji-button">😄</button>

          {mostrarEmojis && (
            <div className="emoji-picker">
              <Picker onEmojiClick={agregarEmoji} height={300} />
            </div>
          )}
        </div>

        <button onClick={enviarMensaje} className="boton">➤</button>
      </div>


      {estado && (
        <div className="chat-status" style={{ color: colorEstado(estado.tipo) }}>
          {estado.texto}
        </div>
      )}

      <div className="usuarios-conectados">
        <h4>🟢 Usuarios conectados:</h4>
        <ul>
          {usuariosConectados.length > 0 ? (
            usuariosConectados.map((u, i) => <li key={i}>{u}</li>)
          ) : (
            <li>No hay usuarios conectados.</li>
          )}
        </ul>
      </div>

      <ul className="chat-lista" ref={mensajesRef}>
        {mensajes.length > 0 ? (
          mensajes.map((msg, i) => (
            <li
              key={i}
              className={`chat-mensaje ${msg.Username === usuario ? "derecha" : "izquierda"}`}
            >
              <div className="mensaje-cabecera">
                {usuariosConectados.includes(msg.Username) && (
                  <span className="punto-verde-inline" title="Usuario conectado"></span>
                )}
                <strong>{msg.Username}</strong>: {msg.Content}
              </div>
              <small className="chat-hora">🕒 {msg.CreatedAt}</small>
            </li>
          ))
        ) : (
          <li>No hay mensajes disponibles.</li>
        )}
      </ul>
      <footer className="login-footer">
        <p>
          © {new Date().getFullYear()} Max | Lima, Perú. Todos los derechos reservados.
          <span className="footer-time">{hora}</span>
        </p>
      </footer>
    </div>
  );
}

function colorEstado(tipo) {
  return {
    success: "green",
    warning: "orange",
    error: "red"
  }[tipo] || "black";
}
