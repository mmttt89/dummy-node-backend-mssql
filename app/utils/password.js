const bcrypt = require('bcrypt');

exports.comparePasswords = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

exports.encryptPassword = async (password) => {
    const saltRounds = 10
    return await bcrypt.hash(password, saltRounds)
}
