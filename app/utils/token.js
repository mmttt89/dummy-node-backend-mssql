const jwt = require('jsonwebtoken');
const {secretKey} = require("../../config/constants")

exports.generateToken = (userId) => {
    const token = jwt.sign({userId}, secretKey, {expiresIn: '1h'}); // Token expires in 1 hour
    return token;
}
