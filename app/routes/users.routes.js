module.exports = app => {
    const userController = require('../controllers/users.controller');

    app.route('/users')
        .get(userController.read);

    app.route('/users/username/:username')
        .get(userController.readByUsername);

    app.route('/users/email/:email')
        .get(userController.readByEmail);

    app.route('/users/:id')
        .put(userController.updateById)
        .delete(userController.deleteById)
        .get(userController.readById);

    app.route('/users/login').post(userController.login)
    app.route('/users/register').post(userController.register)
}