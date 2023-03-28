import jwt from 'jsonwebtoken';

export function createToken(sub, name, avatar, fullname) {
    return jwt.sign({
        sub: sub,
        name: name,
        owner: fullname,
        avatar: avatar,
        iat: Date.now()
    }, process.env["SECRET"], { expiresIn: Math.floor(Date.now() / 1000 + (60 * 60)) })
}

export function verifyToken(token) {
    try {
        jwt.verify(token, process.env["SECRET"])
        return true
    } catch (e) {
        return false
    }
}

export function readToken(token) {
    return jwt.decode(token)
}