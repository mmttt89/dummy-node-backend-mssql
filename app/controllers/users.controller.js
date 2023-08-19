const UsersRepo = require('../repositories/users.repo')
const TokenRepo = require('../repositories/token.repo')
const Password = require("../utils/password")
const Token = require("../utils/token")
const AuthResponse = require("../models/dto/AuthResponse")
const User = require("../models/entity/User")

exports.register = async (req, res) => {
    try {
        const {username, email, password} = req.body;

        // Check if the username or email is already taken
        const foundUsername = await UsersRepo.readByUsername(username);
        if (foundUsername) {
            return res.status(400).json({message: 'Username already taken.'});
        }

        const foundEmail = await UsersRepo.readByEmail(email);
        if (foundEmail) {
            return res.status(400).json({message: 'Email already registered.'});
        }

        const hasedPassword = await Password.encryptPassword(password)

        // create a new user
        const newUser = new User({username, email, password: hasedPassword})
        const {data: user} = await UsersRepo.create(newUser);

        if (!user) {
            return res.status(500).json({message: 'Failed to register user.'});
        }

        // make a token
        const token = Token.generateToken(user.id);
        const tokenRes = await TokenRepo.saveToken(user.id, token);
        if (tokenRes.length > 0) {
            res.status(201).json(new AuthResponse({token, user, message: "Login Succesfull"}));
        }
        else {
            res.status(500).json({message: 'token registration failed'});
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({message: 'An error occurred during registration.'});
    }
}

exports.login = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await UsersRepo.readByUsername(username);
        const passcheck = await Password.comparePasswords(password, user?.password || "")

        if (!user || !passcheck) {
            res.status(401).send({message: 'Invalid credentials.'});
            return;
        }

        // Generate a JWT token and store it in the Token table
        const token = Token.generateToken(user.id);        
        const foundedToken = await TokenRepo.findTokenByUserId(user.id)           

        let tokenRes = 0
        if (foundedToken.length > 0) {            
            tokenRes = await TokenRepo.updateToken(user.id, token);
        } else {         
            tokenRes = await TokenRepo.saveToken(user.id, token);
        }
        
        if (tokenRes.length > 0) {
            res.status(201).json(new AuthResponse({token, user, message: "Login Succesfull"}));
        }
        else {
            res.status(500).json({message: 'token registration failed'});
        }

    } catch (error) {
        console.log({error});
        res.status(500).send({message: 'Login failed.'});
    }
}

exports.read = async (req, res) => {
    const user = await UsersRepo.read();
    res.status(200).send(user)
}

exports.updateById = async (req, res) => {
    const user = await UsersRepo.update(req.params.id, req.body)

    if (user) {
        res.status(200).send({message: 'Ok!'})
    } else {
        res.status(500).send({message: 'Error.'})
    }
}

exports.deleteById = async (req, res) => {
    const user = await UsersRepo.delete(req.params.id, req.body);

    if (user) {
        res.status(200).send({message: 'Ok!'})
    } else {
        res.status(500).send({message: 'Error.'});
    }
}

exports.readByIdOrUsernameOrEmail = async (req, res) => {
    const {idOrUsernameOrEmail} = req.params;

    // Check if idOrUsernameOrEmail is a number (for id) or a string (for username/email)
    if (!isNaN(idOrUsernameOrEmail)) {
        const id = parseInt(idOrUsernameOrEmail);
        const user = await UsersRepo.readById(id);
        res.status(200).send(user);
    } else {
        const userByUsername = await UsersRepo.readByUsername(idOrUsernameOrEmail);
        if (userByUsername) {
            res.status(200).send(userByUsername);
        } else {
            const userByEmail = await UsersRepo.readByEmail(idOrUsernameOrEmail);
            if (userByEmail) {
                res.status(200).send(userByEmail);
            } else {
                res.status(404).send({message: 'User not found'});
            }
        }
    }
}

exports.readById = async (req, res) => {
    const {id} = req.params
    if (typeof id === "number") {
        const user = await UsersRepo.readById(id)
        res.status(200).send(user)
    }
    else {
        res.status(500).send({message: 'Error: id must be number'});
    }
}

exports.readByEmail = async (req, res) => {
    const {email} = req.params

    if (!email) {
        return res.status(400).send({message: 'Email parameter is required'});
    }

    if (typeof email === "string") {
        const user = await UsersRepo.readByEmail(email)
        res.status(200).send(user)
    }
    else {
        res.status(500).send({message: 'Error: email must be string'});
    }
}

exports.readByUsername = async (req, res) => {
    const {username} = req.params

    if (!username) {
        return res.status(400).send({message: 'Username parameter is required'});
    }
    if (typeof username === "string") {
        const user = await UsersRepo.readByUsername(username)
        res.status(200).send(user)
    }
    else {
        res.status(500).send({message: 'Error: username must be string'});
    }
}