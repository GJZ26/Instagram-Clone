import { Op } from "sequelize";
import User from "../models/userModels.mjs";
import { compare } from "../security/encryptor.mjs";
import { createToken } from "../security/tokens.mjs";

export async function loginService(username, email = username, password) {
    const { count, rows } = await User.findAndCountAll({
        where: {
            [Op.or]: [
                { username: email },
                { email: email }
            ]
        }
    })

    if (count < 1) {
        return {
            status: false,
            data: {
                message: "No hemos podido encontrar usuarios con el username o email proporcionado..."
            }
        }
    }


    if (compare(password, rows[0].getDataValue("pwd"))) {
        return {
            status: true,
            data: {
                message: "Autenticación con éxito",
                token:createToken(rows[0].getDataValue("id"),username)
            }
        }
    }

    return {
        status: false,
        data: {
            message: "Las contraseñas no coinciden"
        }
    }
}