# Instagram Clone
Instagram Clone es un backend multi-servicio para un proyecto que pretende **imitar** las funcionalidades de Instagram.

El proyecto consta de **3 servicios** que se ejecutan de manera simultánea para que pueda realizar peticiones de forma segura y rápida.

Para este proyecto, empleamos tanto base de datos relacionales (*MySQL*) y no relacionales (*MongoDB*).
# Instagram Clone
Instagram Clone es un backend multi-servicio para un proyecto que pretende **imitar** las funcionalidades de Instagram.

El proyecto consta de **3 servicios** que se ejecutan de manera simultánea para que pueda realizar peticiones de forma segura y rápida.

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
- [Arquitectura](#arquitectura)
  - [REST](#rest)
  - [Provider](#provider)
  - [Consumer](#consumer)
- [Lista de servicios](#lista-de-servicios)
- [API - REST](#api---rest)
  - [Endpoints](#endpoints)
  - [**Login**](#login)
    - [**Request** - Body/JSON](#request---bodyjson)
    - [**Response** - JSON](#response---json)
  - [**Sign Up**](#sign-up)
    - [**Request** - Body/Multipart-Form](#request---bodymultipart-form)
    - [**Response** - JSON](#response---json-1)
- [Provider - WEB SOCKET](#provider---web-socket)
  - [Emisiones](#emisiones)
    - [POST](#post)
    - [GETALL](#getall)
  - [Recepciones](#recepciones)
    - [Posts](#posts)
    - [Feed](#feed)
    - [Log](#log)
  - [Errno Definiciones](#errno-definiciones)

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

-------------
# Arquitectura

Los servicios de Instagram Clone están diseñados y pensados para funcionar de una forma confiable, eficaz y constante.

Este proyecto cuenta con tres servicios que trabajan en conjunto: **Rest**, **Consumer** y **Provider**.

Estos servicios se distribuyen el trabajo de almacenamiento de datos, gestion de solicitudes y envío de notificaciones, en conjunto con servicios a terceros.

A continuación una representación del cómo nuestros servicios se comunican entre sí y su ruta de trabajo.

![Arquitectura de IG Clone](doc-img/ProjectSchema.png)

Cada servicio tiene un fin en específico:

## REST
REST es un servicio que levanta un endpoint para realizar peticiones HTTP.

Este servicio se ejecuta de forma indendiente y aislada de los demás servicio. Su funcionalidad principal es recibir peticiones de registro de usuarios, y autenticación.

Para las peticiones de **registro**, el servicio recibe los datos, los verifica, sube contenido a los servicios de S3 (en caso de ser necesario), y almacena los registros dentro una base de datos relaciona MySQL, donde almacena información como: nombre, nombre de usuario, foto de perfil y contraseña.

Implementa módulos de seguridad para encriptar las contraseñas y entregar y firmar tokens de autenticación para futuras peticiones.

Para las peticiones de **ingreso**, el servicio consulta las credenciales entregadas con los registros de los usuarios actuales de la base de datos, y al igual que el servicio de registro, provee de tokens de autenticación firmadas para realizar peticiones, e información adicional que puede ser de utilidad al momento de renderizar contenido relacionado al usuario.

Este servicio, al no ser un trabajo de concurrencia alta, hemos decidido no implementar un broker para gestionar las solicitudes.

## Provider
Este servicio acepta eventos a través eventos, lo que permite a los clientes enviar datos en tiempo real desde sus aplicaciones web.

Los dos eventos que recibe son `GETALL`, y `POST`, los cuales sirven para crear publicaciones y recuperar todas las publicaciones almacenada en la base de datos respectivamente.

Una vez recibido el evento, el servicio se encarga de validar su contenido. Para esto, el servicio utiliza una serie de reglas y validaciones predefinidas para asegurarse de que el evento sea correcto y cumpla con los requisitos necesarios para ser procesado por el sistema.

Si el evento es válido, el servicio lo añade a la cola de **Rabbit MQ** (únicamente en los eventos de tipo `POST`), utilizando el puerto por defecto del sistema. La cola de Rabbit MQ permite que el evento sea almacenado temporalmente y procesado posteriormente por otros sistemas o aplicaciones.

Este servicio proporciona una solución robusta y escalable para el procesamiento de eventos en tiempo real. La validación de eventos garantiza que solo los datos correctos y precisos sean procesados, lo que aumenta la calidad y confiabilidad de los datos de salida. Además, la capacidad de almacenamiento temporal de la cola de Rabbit MQ permite que el sistema sea más tolerante a fallos y pueda manejar picos de trásito.

## Consumer

Consumer es un servicio eficiente que permite consumir eventos de una cola de RabbitMQ llamada "request". Su principal función es automatizar el proceso de almacenamiento del contenido de las publicación realizada en un bucket de S3 de AWS, guardar el resto dela información, como `Descripción`, `Autor`, etcétera; en un documento de una base de datos no relacional (*MongoDB*), envía notificaciones por el servicio SNS de AWS a todos los usuarios, para notificar que hay nuevo contenido y agrega un evento a la cola "response" de RabbitMQ con la información que se almaceno en la base de datos de MongoDB y el URI del objeto que se subió a S3, que después será emitida en forma de broadcast por el servicio `provider`.

De este modo, tenemos este proceso de almacenamiento de datos de forma fiable, y al alcance de todos los usuarios, gracias a los eventos que permiten enviar dichos registros a todos los usuarios en tiempo real.

-------------
# Lista de servicios
En esta sección encontrarás qué hace cada servicio y como realizar peticiones de forma correcta.

# API - REST
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
>  En esta opción de registro, donde el usuario no asigna ninguna fotografía de perfil, el servidor le asignará de forma automática y aleatoria una foto de perfil por defecto.

Registrando un nuevo usuario con avatar.

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
# Provider - WEB SOCKET
* Descripción: Eventos de publicaciones y recepción de publicaciones nuevas por otros usuarios.
* Puerto de escucha: **3031**

## Emisiones
Eventos que el cliente **envía** al servidor

### POST
Evento para subir una nueva publicación.
```javascript
const params = {
    caption:"Descripción de tu publicación - opcional",
    token:"Token de autenticación del usuario - obligatorio",
    media: <FileObject> // Obligatorio
}

io.emit("POST", params)
```

### GETALL
Evento para solicitar todos las publicaciones de la base de datos.
```javascript
const params = {
    token:"Token de autenticación del usuario - obligatorio"
}

io.emit("GETALL", params)
```

## Recepciones
Eventos que el cliente **recibe** del servidor.

Algunos eventos retornan objectos de tipo Post o Array de éstos mismos, este es un ejemplo de un Objeto Post:

```json
{ // ObjectPost Example
  "_id": {
    "$oid": "642253241b08aa4a00b5d2b1"
  },
  "date": {
    "$date": {
      "$numberLong": "1679970773963"
    }
  },
  "username": "CoolUser",
  "name": "A Named Cool User",
  "avatar": "uri://to.avatar.user/picture.jpg",
  "media": "uri://to.post.media/picture.jpg",
  "caption": "",
  "__v": 0
}
```

### Posts
Todas las publicaciones de la base de datos, respuesta de la emisión `GETALL`.
```json
{
    "status": true,
        "data": {
            "message": "Lista de publicaciones recuperada",
            "records": <Array Posts>
        }
}
```

ó en caso de error

```json
{
    "status": false,
    "data": {
        "errno": 4,
        "message": "Ha ocurrido un error al momento de recuperar los datos de la base de datos"
    }
}
```

### Feed
Este evento se emite una vez el evento `POST` haya sido compleatada con éxito se emite a TODOS los clientes conectados al servidor.

```json
{
    "status": false,
    "data": {
        "message": "Nueva publicación",
        "attribute": <ObjectPost>
    }
}
```

 ó en caso de error

```json
{
    "response" : {
        "status": false,
        "data": {
            "errno": 3,
            "message": "No se ha podido completar el registro a la base de datos",
            "datails": <ObjectError>
        }
    }
}
```

ó

```json
{
    "status": false,
    "data": {
        "errno": 2,
        "message": "No se ha adjuntado imagen"
    }
}
```

### Log
Este evento se ejecuta cuando ocurre un error antes tratando algún evento que enviaste. Los eventos que provoquen ésta emision, no llegan a ser añadido a la cola del broker.


+ En caso de que hayas emitido algún evento con un token inválido o expirado.
```json
{
    "status": false,
    "data": {
        "errno": 1,
        "message": "Token inválido o expirado"
    }
}
```

+ En caso de emitir un evento `POST` sin imagen
```json
{
    "status": false,
    "data": {
        "errno": 2,
        "message": "No se ha adjuntado imagen"
    }
}
```

## Errno Definiciones
+ *errno* **1**: El token de tu último evento emitido ha expirado, está corrupto o ha expirado.
+ *errno* **2**: Tu emision `POST` no contiene ninguna imagen en su data.
+ *errno* **3**: Ha ocurrido un error durante el almacenamiento de tu publicación dentro de la base de datos no relacional.
+ *errno* **4**: No se ha podido recuperar las publicaciones almacenadas en la base de datos.

