const User = require('../models/User')
const {compare} = require('bcryptjs')

function checkAllFields(body) {
    const keys = Object.keys(body)

    for (key of keys) {
        if (body[key] == "")
            return {
                user: body,
                error: 'Por favor, preencha todos os campos.'
            }            
    }
}

async function show(req, res, next) {
    const { userId: id } = req.session

    const user = await User.findOne({where: {id} })

    if(!user) return res.render('users/register', {
        error: 'Usuário não encontrado'
    })

    req.user = user

    next()
}

async function store(req, res, next) {    
    const fillAllFields = checkAllFields(req.body)

    if(fillAllFields) {
        return res.render('users/register', fillAllFields)
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

async function update(req, res, next) {
    const fillAllFields = checkAllFields(req.body)

    if(fillAllFields) {
        return res.render('users/index', fillAllFields)
    }

    const { id, password } = req.body

    if (!password) return res.render('users/index', {
        user: req.body,
        error: 'Coloque sua senha para atualizar o cadastro'
    })

    const user = await User.findOne({ where: {id}})

    const passed = await compare(password, user.password)

    if(!passed) return res.render('users/index', {
        user: req.body,
        error: 'Senha incorreta'
    })

    req.user = user

    next()
}

module.exports = { store, show, update }