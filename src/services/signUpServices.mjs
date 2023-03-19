import { Op } from "sequelize";
import User from "../models/userModels.mjs";

export async function signUp(username, email, password) {
    const user = await User.count({
        where: {
            [Op.or]:[
                {username: username},
                {email: email}
            ]
        }
    })

    if(user>0){
        return {
            status:true,
            data:{
                message:"Ya existe una cuenta con éste correo electrónico a email"
            }
        }
    }

    const newuser = await User.create({
        username: username,
        email: email,
        pwd: password
    })

    return {
        status:true,
        data:{
            message:"Usuario creado con éxito",
            username: newuser.username
        }
    };
}