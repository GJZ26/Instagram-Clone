import bycript from 'bcrypt'

export function encrypt(plainText) {
    return bycript.hashSync(plainText, 6);
}

export function compare(inputPassword, storedPassword) {
    return bycript.compareSync(inputPassword, storedPassword);
}