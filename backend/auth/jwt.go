package auth

import (
    "errors"
    "time"
    "github.com/golang-jwt/jwt/v5"
    "github.com/joho/godotenv"
    "os"
    "log"
)

func init() {
    err := godotenv.Load() 
    if err != nil {
        log.Fatal("Error al cargar el archivo .env")
    }
}

var claveSecreta = []byte(os.Getenv("JWT_SECRET_KEY")) 

func GenerarToken(username string) (string, error) {
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "username": username,
        "exp":      time.Now().Add(time.Hour * 2).Unix(), // 2 horaas de duración
    })

    return token.SignedString(claveSecreta)
}

func ValidarToken(tokenString string) (string, error) {
    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, errors.New("firma no válida")
        }
        return claveSecreta, nil
    })

    if err != nil {
        return "", err
    }

    if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
        username := claims["username"].(string)
        return username, nil
    }

    return "", errors.New("token inválido")
}
