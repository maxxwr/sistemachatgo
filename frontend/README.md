# Chat Interactivo y Seguro con Mensajes en Tiempo Real

Este proyecto proporciona una plataforma de chat en tiempo real donde los usuarios pueden interactuar de manera segura, enviando mensajes, usando emojis y recibiendo notificaciones de conexión. La autenticación está basada en un token JWT y la comunicación se realiza mediante WebSockets, garantizando una experiencia fluida y dinámica.

--------------------------------------------------

## 🛠 Tecnologías Utilizadas

- **Go** 
- **React (node.js)**
- **MySQL**
- **Autenticación (JWT)** 
- **CSS** 

--------------------------------------------------

## Ejecutar la app

- **Backend**: go run main.go
- **Frontend**: npm start

--------------------------------------------------

## 🚀 Funcionalidades

- **Registro de usuarios**: Nombre de usuario, correo electrónico y contraseña.
- **Autenticación JWT**: Inicio de sesión con nombre de usuario y contraseña, generando un token JWT.
- **Chat en tiempo real**: Enviar mensajes, ver usuarios conectados y el historial de mensajes.
- **Modo oscuro**: Alternar entre modo claro y oscuro.
- **Selección de emojis**: Añadir emojis a los mensajes.
- **Notificaciones de conexión**: Recibir notificaciones cuando otros usuarios se conectan

--------------------------------------------------

## ⚙️ Cómo Instalar

1. **Go** 
2. **Node.js**
3. **MySQL** 

--------------------------------------------------

## ✨ Desarrollado por

Max:
📍 Lima, Perú 🇵🇪
📧 maxwinchez@gmail.com

--------------------------------------------------

## Importar la base de datos `chatgo.sql` desde phpMyAdmin

1. Crea una nueva base de datos llamada `chatgo`.
2. Selecciona la base de datos `chatgo` y ve a la pestaña importar.

--------------------------------------------------

----------------------------------------------------------------------------------------------------
### Configura el archivo `.env` con los siguientes parámetros:

Asegúrate de crear un archivo `.env` en la raíz de tu proyecto **Backend** y agregar las siguientes configuraciones:

```env
# Poner la cadena de conexión a la base de datos MySQL en (.evn)
DB_CONNECTION_STRING=root@tcp(127.0.0.1:3306)/chatgo
---------------------------------------------------
# Poner la clave secreta JWT en (.evn) 
JWT_SECRET_KEY=tu_clave_secreta_aqui

----------------------------------------------------------------------------------------------------