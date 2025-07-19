package handlers

import (
    "encoding/json"
    "net/http"
    "backend/db"
    "backend/auth"
)

type Credenciales struct {
    Nombre     string `json:"username"`
    Contrasena string `json:"password"`
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
    var creds Credenciales
    err := json.NewDecoder(r.Body).Decode(&creds)
    if err != nil {
        http.Error(w, "Error en el formato", http.StatusBadRequest)
        return
    }

    var count int
    err = db.DB.Get(&count, "SELECT COUNT(*) FROM usuarios WHERE nombre = ? AND contrasena = ?", creds.Nombre, creds.Contrasena)
    if err != nil || count == 0 {
        w.WriteHeader(http.StatusUnauthorized)
        json.NewEncoder(w).Encode(map[string]string{"error": "Usuario no encontrado"})
        return
    }

    // ✅ Generar token
    token, err := auth.GenerarToken(creds.Nombre)
    if err != nil {
        w.WriteHeader(http.StatusInternalServerError)
        json.NewEncoder(w).Encode(map[string]string{"error": "Error al generar token"})
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{
        "message": "Login exitoso",
        "token":   token,
    })
}
