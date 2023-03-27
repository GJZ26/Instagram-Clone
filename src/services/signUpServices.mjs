import { Op } from "sequelize";
import User from "../models/userModels.mjs";
import { encrypt } from "../security/encryptor.mjs";
import { createToken } from "../security/tokens.mjs";

export async function signUpService(username, email, password, name, avatarURI) {
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
            status: false,
            data: {
                message: "Ya existe una cuenta con éste correo electrónico o username"
            }
        }
    }

    const newuser = await User.create({
        name: name,
        username: username,
        email: email,
        pwd: encrypt(password),
        profilePicture: avatarURI
    })


    return {
        status: true,
        data: {
            message: "Usuario creado con éxito",
            token: createToken(newuser.getDataValue("id"), username, avatarURI),
            username: username,
            avatar: avatarURI
        }
    };
}