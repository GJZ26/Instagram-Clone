import { signUpService } from "../services/signUpServices.mjs";
import { loginService } from "../services/loginServices.mjs";

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
export async function signup(req, res) {
    const { username, email, password, name, avatar=false } = req.body

    var signatures = {
        png: "image/png",
        jpg: "image/jpg",
        jpeg: "image/jpeg"
      };
      
      /**
       * 
       * @param {String} b64 
       */
      function detectMimeType(b64) {
        if(b64.includes(signatures.jpg)) return signatures.jpg
        if(b64.includes(signatures.jpeg)) return signatures.jpeg
        if(b64.includes(signatures.png)) return signatures.png
      }

    console.log(detectMimeType(avatar))

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

    res.json(await signUpService(username.trim(), email.trim(), password.trim(), name.trim(),avatar))
}