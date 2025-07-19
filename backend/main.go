package main

import (
    "fmt"
    "log"
    "net/http"

    "backend/db"
    "backend/handlers"

    "github.com/rs/cors"
)

//by MAXXXX
func main() {
    db.InitDB()
    fmt.Println("🚀 Servidor iniciado en http://localhost:8080")

    // ENDPOINTS API REST
    http.HandleFunc("/mensajes", handlers.GetMessages)
    http.HandleFunc("/login", handlers.LoginHandler)
    http.HandleFunc("/registro", handlers.RegistrarUsuario)
    http.HandleFunc("/ws", handlers.HandleConnections)

    // Ruta raiz para mostrar mensaje en el navegador
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintln(w, "✅ API de backend funcionando correctamente 😍")
    })

  
    handler := cors.AllowAll().Handler(http.DefaultServeMux)

    go handlers.HandleMessages()

    err := http.ListenAndServe(":8080", handler)
    if err != nil {
        log.Fatal("❌ Error al iniciar servidor:", err)
    }
}
