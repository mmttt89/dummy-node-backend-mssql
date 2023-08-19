class User {
    constructor({id, username, email, password, firstName, lastName, gender, image}) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.password = password;
        this.firstName = firstName || "";
        this.lastName = lastName || "";
        this.gender = gender || "";
        this.image = image || "";
    }
}

module.exports = User;