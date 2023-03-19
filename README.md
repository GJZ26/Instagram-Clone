# Instagram Clone
Servicios de lado del servidor para un clon de instagram.

# Instalación
Instala las dependencias con `npm install`.

Una vez instalado, ejecuta `npm start`, por defecto el programa se ejecutará en el puerto 3030, puedes cambiar la configuración desde el archivo *server-config.json* dentro del directorio *src/*.

# Endpoints

## **Login** 
**URL**

`http://localhost:3030/auth/login`

**Request - Body**

Accediendo con nombre de usuario.
```json
{
    "username" : "CoolUser",
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
Accediendo con correo electrónico y usename.
```json
{
    "username" : "CoolUser",
    "email" : "sample@mail.com",
    "password" : "PasdWd2!"
}
```
> Note: Aunque es la forma más recomendada en caso de no saber qué tipo de valor ingreso el usuario, el servidor tendrá preferencia buscando el valor como email.

**Response**

En caso de hacer faltar algún username y email.
```json
{
    "status": false,
        "data": {
        "message": "No se puede acceder a una cuenta sin un email o username válido",
    }
}
```

En caso de no propocionar una contraseñas correctas.
```json
{
    "status": false,
        "data": {
        "message": "No se puede acceder a una cuenta sin contraseña"
    }
}
```

En caso de propocionar una contraseñas incorrecta.
```json
{
    "status": false,
    "data": {
        "message": "Las contraseñas no coinciden"
    }
}
```

En caso de no haber coincidencia de algún registro con el username o email proporcionado

```json
{
    "status": false,
        "data": {
        "message": "No hemos podido encontrar usuarios con el username o email proporcionado..."
    }
}
```

En caso de autenticación exitosa.
```json
{
    "status": true,
        "data": {
        "message": "Se ha podido autenticar con éxito!"
    }
}
```

## **Signup**

**URL**

`http://localhost:3030/auth/signup`

**Request - Body**

Registro de un nuevo usuario.
```json
{
    "username":"CoolUser",
    "email":"coolme@mail.com",
    "password":"pAszW0rD%"
}
```

Todos los campos son obligatorios.

Para el campo *Password* es necesario ingresar un texto de al menos 8 carácteres de longitud.

**Response**

En caso de hacer faltar algún atributo necesario.
```json
{
    "status":false,
    "data":{
        "message":"Mensaje indicando qué campo hizo falta"
    }
}
```

En caso de haber un usuario con la misma información.
```json
{
    "status":false,
    "data":{
        "message":"Mensaje indicando el email o username ya están siendo usado por otro usuario"
    }
}
```

En caso de haber concluido el registro con éxito.
```json
{
    "status":false,
    "data":{
        "message":"Mensaje indicando el registro exitoso"
    }
}
```