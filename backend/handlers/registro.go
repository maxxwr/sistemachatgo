package handlers

import (
    "encoding/json"
    "net/http"
    "backend/db"
)

type Usuario struct {
    Nombre     string `json:"username"`
    Email      string `json:"email"`
    Contrasena string `json:"password"`
}

func RegistrarUsuario(w http.ResponseWriter, r *http.Request) {
    var user Usuario
    err := json.NewDecoder(r.Body).Decode(&user)
    if err != nil {
        http.Error(w, "Error en los datos", http.StatusBadRequest)
        return
    }

    _, err = db.DB.Exec("INSERT INTO usuarios(nombre, email, contrasena) VALUES (?, ?, ?)", user.Nombre, user.Email, user.Contrasena)
    if err != nil {
        w.WriteHeader(http.StatusInternalServerError)
        json.NewEncoder(w).Encode(map[string]string{"error": "Error al registrar usuario"})
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{"message": "Usuario registrado con éxito"})
}
