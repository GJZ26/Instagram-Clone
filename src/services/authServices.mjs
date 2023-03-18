/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export function login(req, res) {
    const { username, email, password } = req.body;

    if(username === undefined && email=== undefined){
        res.json({
            status:false,
            data:{
                message:"No se puede acceder a una cuenta sin un email o username válido",
            }
        })
    }

    if(password === undefined){
        res.json({
            status:false,
            data:{
                message:"No se puede acceder a una cuenta sin contraseña"
            }
        })
    }
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export function signup(req, res) {

}