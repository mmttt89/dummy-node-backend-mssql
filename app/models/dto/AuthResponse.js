class AuthResponse {
    constructor({token, message, user}) {
        this.token = token;
        this.message = message;
        this.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            gender: user.gender,
            image: user.image
        };
    }
}

module.exports = AuthResponse;