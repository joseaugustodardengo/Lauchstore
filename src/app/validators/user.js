const User = require('../models/User')

async function store(req, res, next) {
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "")
            return res.render('users/register.njk', {
                user: req.body,
                error: 'Por favor, preencha todos os campos.'
            })            
    }

    let { email, cpf_cnpj, password, passwordRepeat } = req.body

    cpf_cnpj = cpf_cnpj.replace(/\D/g, "")

    const user = await User.findOne({
        where: { email },
        or: { cpf_cnpj }
    })

    if (user) return res.render('users/register.njk', {
        user: req.body,
        error: 'Usuário já existe'
    })

    if (password != passwordRepeat) {
        return res.render('users/register.njk', {
            user: req.body,
            error: 'Senha não confere'
        })        
    }

    next()
}

module.exports = { store }