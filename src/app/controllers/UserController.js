const User = require('../models/User')
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
            return res.send('ok, cadastrado')
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
            
            return res.redirect('/users')
            
        } catch (error) {
            console.error(error)
        }
    }
}