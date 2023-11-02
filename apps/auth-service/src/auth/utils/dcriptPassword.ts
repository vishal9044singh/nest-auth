const bcrypt = require("bcrypt")
const saltRounds = 10;

function hashPassword(password) {
    return bcrypt.genSalt(saltRounds)
        .then(salt => {
            return bcrypt.hash(password, salt)
        })
        .then(hash => {
            return hash;
        })
        .catch(err => console.error(err.message))
}

function comparePassword(password, hash) {
    return bcrypt
        .compare(password, hash)
        .then(res => {
            return res;
        })
        .catch(err => console.error(err.message))
}

export {
    hashPassword,
    comparePassword
}
