const User = require('../models/User')
const Product = require('../models/Product')
const LoadProductService = require('../services/LoadProductService')
const fs = require('fs')
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

            const values = {       
                name: req.body.name,
                email: req.body.email,
                password: passwordHash,
                cpf_cnpj: req.body.cpf_cnpj.replace(/\D/g,""),
                cep: req.body.cep.replace(/\D/g,""),
                address: req.body.address
        }

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

            await User.update(user.id, {
                name: req.body.name,
                email: req.body.email,
                cpf_cnpj: req.body.cpf_cnpj.replace(/\D/g,""),
                cep: req.body.cep.replace(/\D/g,""),
                address: req.body.address
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

            const products = await Product.findAll({ where: {user_id : req.body.id}})
            
            const allFilesPromise = products.map(product => 
                Product.files(product.id)
            )
    
            let promiseResults = await Promise.all(allFilesPromise)
        
            await User.delete(req.body.id)    
            req.session.destroy()        

            promiseResults.map(files => {
                files.map(file => {
                    try {
                        fs.unlinkSync(file.path)                        
                    } catch (error) {
                        console.error(error)
                    }

                })
            })

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
    },

    async ads(req, res) {
        const products = await LoadProductService.load('products', {
            where: {user_id: req.session.userId}
        })

        return res.render("users/ads", {products})
    } 
}