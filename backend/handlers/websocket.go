package handlers

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"backend/db"
	"backend/models"
)

//by MAXXXX
var upgrader = websocket.Upgrader{}

var clients = make(map[*websocket.Conn]string) 
var broadcast = make(chan models.Message)
var usuariosConectados = make(map[string]bool) 

func HandleConnections(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer ws.Close()

	var username string

	for {
		var msg models.Message
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Printf("❌ Error al leer mensaje JSON: %v", err)
			if username != "" {
				delete(usuariosConectados, username)
				broadcastUsuarios()
			}
			delete(clients, ws)
			break
		}

		if _, ok := clients[ws]; !ok {
			username = msg.Username
			clients[ws] = username
			usuariosConectados[username] = true
			broadcastUsuarios()
		}

		log.Printf("📩 Mensaje recibido de %s: %s", msg.Username, msg.Content)

		var count int
		err = db.DB.Get(&count, "SELECT COUNT(*) FROM messages WHERE username = ? AND content = ?", msg.Username, msg.Content)
		if err != nil {
			log.Println("❌ Error al verificar duplicado:", err)
			sendStatus(ws, "Error al verificar duplicado", "error")
			continue
		}

		if count > 0 {
			log.Printf("⚠️ Mensaje duplicado de '%s': '%s' — No se guarda.", msg.Username, msg.Content)
			sendStatus(ws, "Este mensaje ya fue enviado antes", "warning")
			continue
		}

		// Insertar mensaje en la base de datos
		_, err = db.DB.Exec("INSERT INTO messages(username, content, created_at) VALUES (?, ?, NOW())",
			msg.Username, msg.Content)
		if err != nil {
			log.Println("❌ Error al guardar mensaje:", err)
			sendStatus(ws, "No se pudo guardar el mensaje", "error")
			continue
		}

		log.Printf("✅ Mensaje guardado con éxito de %s", msg.Username)
		sendStatus(ws, "Mensaje enviado con éxito", "success")

		broadcast <- msg
	}
}

// Envía mensaje de estado
func sendStatus(conn *websocket.Conn, message string, statusType string) {
	statusMsg := map[string]string{
		"type":    "status",
		"message": message,
		"status":  statusType,
	}
	err := conn.WriteJSON(statusMsg)
	if err != nil {
		log.Printf("❌ Error al enviar estado al cliente: %v", err)
	}
}

// Envía la lista de usuarios conectados
func broadcastUsuarios() {
	lista := []string{}
	for usuario := range usuariosConectados {
		lista = append(lista, usuario)
	}

	for client := range clients {
		err := client.WriteJSON(map[string]interface{}{
			"type":     "usuarios",
			"usuarios": lista,
		})
		if err != nil {
			log.Printf("❌ Error al enviar lista de usuarios: %v", err)
			client.Close()
			delete(clients, client)
		}
	}
}

// Enviar mensajes a todos
func HandleMessages() {
	for {
		msg := <-broadcast
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Printf("❌ Error al enviar mensaje: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}
