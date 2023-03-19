import { Op } from "sequelize";
import User from "../models/userModels.mjs";

export async function signUpService(username, email, password) {
    const user = await User.count({
        where: {
            [Op.or]: [
                { username: username },
                { email: email }
            ]
        }
    })

    if (user > 0) {
        return {
            status: true,
            data: {
                message: "Ya existe una cuenta con éste correo electrónico a email"
            }
        }
    }

    const newuser = await User.create({
        username: username,
        email: email,
        pwd: password
    })

    return {
        status: true,
        data: {
            message: "Usuario creado con éxito",
            username: newuser.username
        }
    };
}

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


    if (rows[0].getDataValue("pwd") !== password) {
        return {
            status: false,
            data: {
                message: "Las contraseñas no coinciden"
            }
        }
    }

    return {
        status: true,
        data: {
            message: "Se ha podido autenticar con éxito!"
        }
    }
}