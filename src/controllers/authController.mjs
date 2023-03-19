import { signUp } from "../services/signUpServices.mjs";

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export function login(req, res) {
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
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export async function signup(req, res) {
    const { username, email, password } = req.body

    if (username === undefined || email.trim() === "") {
        res.json({
            status: false,
            data: {
                message: "No puedes crear una cuenta sin nombre de usuario"
            }
        })
        return;
    }

    if (email === undefined || email.trim() === "") {
        res.json({
            status: false,
            data: {
                message: "No se puede crear una cuenta sin un correo electrónico"
            }
        })
        return;
    }

    if (password === undefined || password.length < 8 || password.trim() === "") {
        res.json({
            status: false,
            data: {
                message: "La contraseña debe tener al menos 8 carácteres de largo"
            }
        })
        return;
    }


    res.json(await signUp(username.trim(), email.trim(), password.trim()))
}