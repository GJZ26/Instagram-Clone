import { signUpService } from "../services/signUpServices.mjs";
import { loginService } from "../services/loginServices.mjs";


function pickRanProfilePicture(){
    return `https://ig-clone-resources.s3.amazonaws.com/default/default-${Math.floor(Math.random() * (5 - 1 + 1) + 1)}.png`
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export async function login(req, res) {
    const { username, email, password } = req.body;

    if (username === undefined && email === undefined) {
        res.json({
            status: false,
            data: {
                message: "No se puede acceder a una cuenta sin un email o username válido",
            }
        })
    }

    if (password === undefined) {
        res.json({
            status: false,
            data: {
                message: "No se puede acceder a una cuenta sin contraseña"
            }
        })
    }

    res.json(await loginService(username, email, password))
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export async function signup(req, res, next) {
    const { username, email, password, name} = req.body
    let AvatarURI = req.file ? req.file.location : pickRanProfilePicture()

    if (name === undefined) {
        res.json({
            status: false,
            data: {
                message: "No se puede crear una cuenta sin un nombre"
            }
        })
        return;
    }

    if (username === undefined) {
        res.json({
            status: false,
            data: {
                message: "No puedes crear una cuenta sin nombre de usuario"
            }
        })
        return;
    }

    if (email === undefined) {
        res.json({
            status: false,
            data: {
                message: "No se puede crear una cuenta sin un correo electrónico"
            }
        })
        return;
    }

    if (password === undefined || password.length < 8) {
        res.json({
            status: false,
            data: {
                message: "La contraseña debe tener al menos 8 carácteres de largo"
            }
        })
        return;
    }

    res.json(await signUpService(username.trim(), email.trim(), password.trim(), name.trim(), AvatarURI))
}