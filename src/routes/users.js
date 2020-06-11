const express = require('express')
const routes = express.Router()

const SessionController = require('../app/controllers/SessionController')
const UserController = require('../app/controllers/UserController')

const UserValidator = require('../app/validators/user')
const SessionValidator = require('../app/validators/session')

const {isLoggedRedirectToUsers, onlyUsers } = require('../app/middlewares/session')
// login/logout
routes.get('/login', isLoggedRedirectToUsers, SessionController.loginForm)
routes.post('/login',SessionValidator.login, SessionController.login)
routes.post('/logout',SessionController.logout)

// reset password / forgot
routes.get('/forgot-password',SessionController.forgotForm) //formulário de esqueci senha
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot) //armazenar os dados do formulario de esqueci senha, enviar o email com o token novo
routes.get('/password-reset',SessionController.resetForm) //formulario de resetar a senha, passando a senha nova
routes.post('/password-reset',SessionValidator.reset, SessionController.reset) //armazenar os dados do formulario resetar a senha, com o password novo


//User
routes.get('/register', UserController.registerForm) //formulario de usuario, tanto para cadastrar quanto alterar
routes.get('/', onlyUsers, UserValidator.show, UserController.show) //profile, dashboard após logar
routes.post('/register', UserValidator.store, UserController.store)
routes.put('/', UserValidator.update, UserController.update)
// routes.delete('/', UserController.destroy)

module.exports = routes