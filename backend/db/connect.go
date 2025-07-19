package db

import (
    "log"
    "github.com/jmoiron/sqlx"
    _ "github.com/go-sql-driver/mysql"
    "github.com/joho/godotenv"
    "os"
)

var DB *sqlx.DB

func InitDB() {
    if err := godotenv.Load(); err != nil {
        log.Fatal("Error al cargar el archivo .env")
    }

    dbConnectionString := os.Getenv("DB_CONNECTION_STRING")
    if dbConnectionString == "" {
        log.Fatal("La cadena de conexión a la base de datos no está definida en el archivo .env")
    }

    var err error
    DB, err = sqlx.Open("mysql", dbConnectionString)
    if err != nil {
        log.Fatal("❌ Error al conectar a MySQL:", err)
    }

    err = DB.Ping()
    if err != nil {
        log.Fatal("❌ No se pudo hacer ping a la BD:", err)
    }

    log.Println("✅ Conexión a BD MySQL exitosa! 😊😊")
}
