const User = require('../models/User')
const {formatCpfCnpj, formatCep} = require('../../lib/utils')
const {hash} = require('bcryptjs')

module.exports = {

    async registerForm(req, res) {
        try {            
            return res.render("users/register")
        } catch (error) {

        }
    },
    async show(req,res){
        try {   
            const {user} = req

            user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
            user.cep = formatCep(user.cep)

            return res.render('users/index', {user})
        } catch (error) {
            console.error(error)
        }
    },

    async store(req, res) {
        try {

            const passwordHash = await hash(req.body.password, 8)          

            const values = [        
                req.body.name,
                req.body.email,
                passwordHash,
                req.body.cpf_cnpj.replace(/\D/g,""),
                req.body.cep.replace(/\D/g,""),
                req.body.address
            ]

            const userId = await User.create(values)

            req.session.userId = userId
            
            return res.redirect('/users')
            
        } catch (error) {
            console.error(error)
        }
    },

    async update(req,res) {
        try {
            const {user} = req

            let {name, email, cpf_cnpj, cep, address} = req.body
            
            cpf_cnpj = cpf_cnpj.replace(/\D/g,"")
            cep = cep.replace(/\D/g,"")

            await User.update(user.id, {
                name,
                email,
                cpf_cnpj,
                cep,
                address
            })

            return res.render('users/index', {
                user: req.body,
                success: 'Conta atualizada com sucesso.'
            })

        } catch (error) {
            console.error(error)
            return res.render('users/index', {
                error: 'Algum erro aconteceu.'
            })
        }
    },

    async destroy(req, res) {
        try {
            await User.delete(req.body.id)
            req.session.destroy()

            return res.render("session/login", {
                success: "Conta deletada com sucesso!"
            })
        } catch (error) {
            console.error(error)
            return res.render("user/index",{
                user: req.body,
                error: "Erro ao tentar deletar sua conta!"
            })
        }
    }
}