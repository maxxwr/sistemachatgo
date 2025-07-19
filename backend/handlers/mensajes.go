package handlers

import (
    "encoding/json"
    "log"
    "net/http"

    "backend/auth"
    "backend/db"
    "backend/models"
)

func GetMessages(w http.ResponseWriter, r *http.Request) {
    tokenString := r.Header.Get("Authorization")
    if tokenString == "" {
        http.Error(w, "Token no proporcionado", http.StatusUnauthorized)
        return
    }

    username, err := auth.ValidarToken(tokenString)
    if err != nil {
        http.Error(w, "Token inválido", http.StatusUnauthorized)
        return
    }

    log.Println("🧑 Usuario autenticado:", username)

    var messages []models.Message
    err = db.DB.Select(&messages, "SELECT id, username, content, created_at FROM messages ORDER BY created_at ASC LIMIT 50")
    if err != nil {
        http.Error(w, "Error al obtener mensajes: "+err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(messages)
}
