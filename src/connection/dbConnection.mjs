import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config()

const DATABASE_NAME = process.env["DATABASE_NAME"];
const DATABASE_USERNAME = process.env["DATABASE_USER"];
const DATABASE_PWD = process.env["DATABASE_PASSWORD"];
const DATABASE_HOST = process.env["DATABASE_HOST"];
const DATABASE_PORT = process.env["DATABASE_PORT"];

const db = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PWD, {
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    dialect: 'mysql',
    logging: true
})

try{
    db.authenticate()
    console.log("Conexión a la base de datos exitosa");
}catch(e){
    console.error("Error al conectarse a la base de datos:")
    console.error(e);
}

export default db;