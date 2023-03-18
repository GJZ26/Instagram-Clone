# Instagram Clone
Servicios de lado del servidor para un clon de instagram.

# Instalación
Instala las dependencias con `npm install`.

Una vez instalado, ejecuta `npm start`, por defecto el programa se ejecutará en el puerto 3030, puedes cambiar la configuración desde el archivo *server-config.json* dentro del directorio *src/*.

# Endpoints

## **Login** 
**URL**

`http://localhost:3030/auth/login`

**Body**

Accediendo con nombre de usuario.
```json
{
    "username" : "an-user-cool",
    "password" : "PasdWd2!"
}
```
Accediendo con correo electrónico.
```json
{
    "email" : "sample@mail.com",
    "password" : "PasdWd2!"
}
```

**Response**

En caso de hacer faltar algún atributo necesario
```json
{
    "status":false,
    "data":{
        "message":"Mensaje indicando qué campo hizo falta"
    }
}
```