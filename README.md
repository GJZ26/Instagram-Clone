# Instagram Clone
Instagram Clone es un backend multi-servicio para un proyecto que pretende **imitar** las funcionalidades de Instagram.

El proyecta consta de **3 servicios** que se ejecutan de manera simultánea para que pueda realizar peticiones de forma segura y rápida.

Para este proyecto, empleamos tanto base de datos relacionales (*MySQL*) y no relacionales (*MongoDB*).

# Contenido
- [Instagram Clone](#instagram-clone)
- [Contenido](#contenido)
- [Requisitos](#requisitos)
  - [Runtime](#runtime)
  - [Base de datos](#base-de-datos)
  - [Softwares](#softwares)
  - [Servicios](#servicios)
- [Instalación](#instalación)
- [Lista de servicios](#lista-de-servicios)
- [Consumer - REST](#consumer---rest)
  - [Endpoints](#endpoints)
  - [**Login**](#login)
    - [**Request** - Body/JSON](#request---bodyjson)
    - [**Response** - JSON](#response---json)
  - [**Sign Up**](#sign-up)
    - [**Request** - Body/Multipart-Form](#request---bodymultipart-form)
    - [**Response** - JSON](#response---json-1)

# Requisitos
Instagram Clone utiliza algunos servicios y software de tercero para su funcionamiento. Esta es una lista de software y herramientas necesarias para que el programa funcione de forma óptima:

## Runtime
* **NodeJS** v18 LTS: Entorno en tiempo de ejecución multiplataforma para Javascript, necesaria para la ejecución del proyecto.
* **Docker**: Entorno de ejecución para contenedores, indispensable para la ejecución de algunos servicios de terceros.

## Base de datos
* **MySQL**: Sistema de gestión de bases de datos relacional, necesaria para almacenar registro de usuarios.
* **MongoDB**: Sistema de gestión de base de datos no relacionales, necesaria para almecenar registros de las publicaciones de los usuarios.

> **Note**
> Estos sistemas son necesarias en caso de ejecutar el programa de forma local.

## Softwares
* **RabbitMQ**: Software de negociación de mensajes, usado para administrar los eventos dentro del programa.

## Servicios
* **AWS S3**: Servicio de almacenamiento de objetos, necesario para imágenes de las cuentas y publicaciones.
* **AWS SNS**: Servicio de publicación-suscripción, usado en las notificaciones vía e-mail de los eventos.
* **AWS RDS**: Bases de datos relacionales administrado por AWS, necesaria para almacenar registro de usuarios.
* **MongoDB Atlas**: Sistema de gestión de base de datos no relacionales, necesaria para almecenar registros de las publicaciones de los usuarios.

# Instalación
Una vez cumplido los requisitos, clonaremos el repositorio con el comando: 
```bash
git clone https://github.com/GJZ26/Instagram-Clone.git
```
Accederemos a la carpeta del proyecto, y una vez dentro instalaremos las dependencias necesarias con el siguiente comando:
```bash
npm install
```
Antes de ejecutar los servicios, debemos configurar nuestras credenciales en variable de entorno. Para ello, modificaremos el archivo `.env.example` de la carpeta raíz y completaremos los datos como lo indica el archivo.
```env
DATABASE_NAME = "Nombre de tu base de datos relacional, creada previamente"
DATABASE_HOST = "Host de tu base de datos relacional, DNS, IP o Localhost si en entorno local"
DATABASE_PORT = 3306

DATABASE_USER = "Usuario para acceder a la base de datos relacional"
DATABASE_PASSWORD = "Contraseña del usuario para acceder a la base de datos relacional"

MONGODB_URI_DATABASE = "Tu base de datos MongoDB"

SECRET = "Secreto para encriptar los tokens de autenticación de los usuarios"

AWS_REGION = "Region AWS, por ejemplo us-east-1 "
AWS_ACCESS_KEY = "Clave de acceso de tu usuario con los permisos para S3 y SNS"
AWS_SECRET_KEY = "Clave secreta de tu usuario con los permisos para S3 y SNS"
TOPIC_ARN = "El arn de tu topic de SNS"

BUCKET_NAME = "S3 bucket name"
```

Una vez guardado los cambios, renombraremos el archivo `.env.example` y asignaremos el nombre `.env`

Ahora arrancaremos nuestro contenedor de RabbitMQ. Para ello, ejecutaremos el siguiente comando para tener la versión más actualizada de la imagen de RabbitMQ.

```bash
docker pull rabbitmq
```

Y arrancaremos un nuevo contenedor con el puerto 5672 a la escucha en nuestro dispositivo físico con 
```bash
docker run -itd --hostname rabbitmq --name rabbitmq -p 5672:5672 rabbitmq:latest
```

Ahora estamos listos para arrancar nuestro servicios. Estando dentro de nuestra carpeta del proyecto, al mismo nivel de este archivo, ejecutaremos alguno de los siguientes comandos para habilitar nuestra API REST.
```bash
npm run rest # Finaliza cuando cierres la terminal
# ó
npm run rest & # Sigue ejecutándose aunque hayas finalizado la terminal
```

Luego lanzaremos nuestro event provider con alguno de los siguientes comandos:
```bash
npm run provider # Finaliza cuando cierres la terminal
# ó
npm run provider & # Sigue ejecutándose aunque hayas finalizado la terminal
```

Y finalmente, ejecutaremos nuestro event consumer con el comando:
```bash
npm run consumer # Finaliza cuando cierres la terminal
# ó
npm run consumer & # Sigue ejecutándose aunque hayas finalizado la terminal
```

Y listo! tienes el backend de Ig Clone funcionando de forma correcta, aprende cómo realizar consultas en la siguiente sección

<!-- -------------
# Arquitectura -->

-------------
# Lista de servicios
En esta sección encontrarás qué hace cada servicio y como realizar peticiones de forma correcta.

# Consumer - REST
* Descripción: Este es el servicio REST para realizar peticiones de autenticación, como inicio de sesión y registro de nuevos usuarios.
* Puerto por defecto: **3030**

## Endpoints
## **Login**
- Descripción: Autenticación de usuario para obtención de token de autenticación.

- URI: http://127.0.0.1:3030/auth/login

- Método: **POST**

### **Request** - Body/JSON
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

> **Note**
> En caso de no saber si lo que ingresó el usuario corresponde a un correo o un email, es posible mandar cualquiera de los datos de esta forma, y el servidor retornará un token en caso de que coincida el input como email o usernaeme.


Accediendo con correo electrónico y usename.
```json
{
    "username" : "CoolUser",
    "email" : "sample@mail.com",
    "password" : "PasdWd2!"
}
```

### **Response** - JSON

En caso de hacer faltar algún username y email.
```json
{
    "status": false,
    "data": {
        "message": "No se puede acceder a una cuenta sin un email o username válido"
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
        "message": "Se ha podido autenticar con éxito!",
        "token":"JWTOKEN",
        "name":"An Named User",
        "username":"CoolUser",
        "avatar":"uri://to.avatar.user/content.jpg"
    }
}
```
## **Sign Up**
- Descripción: Registro de un nuevo usuario a la aplicación.

- URI: http://127.0.0.1:3030/auth/signup

- Método: **POST**

### **Request** - Body/Multipart-Form

Registrando un nuevo usuario sin avatar.

| Clave    | Valor              |
| -------- | ------------------ |
| username | coolUser           |
| name     | An Named Cool User |
| email    | sample@mail.com    |
| password | PasdWd2!           |

> **Note**
>  En este opción de registro, donde el usuario no asigna ninguna fotografía de perfil, el servidor de asignará de forma automática y aleatoria una foto de perfil por defecto.

Registrandeo un nuevo usuario con avatar.

| Clave    | Valor              |
| -------- | ------------------ |
| username | coolUser           |
| name     | An Named Cool User |
| email    | sample@mail.com    |
| password | PasdWd2!           |
| avatar   | < Array Buffer>    |

Todos los campos son obligatorios, a excepción de `avatar`.

El campo `password` debe tener contener un String de igual o mayor longitud de 8 caráteres.

### **Response** - JSON

En caso de hacer faltar algún atributo obligatorio.
```json
{
    "status":false,
    "data":{
        "message":"No puedes crear una cuenta sin ..."
    }
}
```

En caso de haber proporcionado una contraseña demasiado corta.
```json
{
    "status":false,
    "data":{
        "message":"La contraseña debe tener al menos 8 carácteres de largo"
    }
}
```

En caso de haber un usuario con el mismo nombre de usuario o email.
```json
{
    "status":false,
    "data":{
        "message":"Ya existe una cuenta con éste correo electrónico o username"
    }
}
```

En caso de haber concluido el registro con éxito.
```json
{
    "status":true,
    "data":{
        "message": "Se ha podido autenticar con éxito!",
        "token":"JWTOKEN",
        "name":"An Named User",
        "username":"CoolUser",
        "avatar":"uri://to.avatar.user/content.jpg"
    }
}
```