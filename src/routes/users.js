const express = require('express')
const routes = express.Router()

const SessionController = require('../app/controllers/SessionController')
const UserController = require('../app/controllers/UserController')


// login/logout
/*
routes.get('/login',SessionController.loginForm)
routes.post('/login',SessionController.login)
routes.post('/logout',SessionController.logout)

// reset password / forgot
routes.get('/forgot-password',SessionController.forgotForm) //formulário de esqueci senha
routes.get('/password-reset',SessionController.resetForm) //formulario de resetar a senha, passando a senha nova
routes.post('/forgot-password',SessionController.forgot) //armazenar os dados do formulario de esqueci senha, enviar o email com o token novo
routes.post('/password-reset',SessionController.reset) //armazenar os dados do formulario resetar a senha, com o password novo
*/

//User
routes.get('/register', UserController.registerForm) //formulario de usuario, tanto para cadastrar quanto alterar
// routes.get('/', UserController.show) //profile, dashboard após logar
// routes.post('/register', UserController.store)
// routes.put('/', UserController.update)
// routes.delete('/', UserController.destroy)

module.exports = routes