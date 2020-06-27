async function fields(req, res, next) {
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "")
            return res.send('Por favor, volte e preencha todos os campos.')
    }    

    next()
}

module.exports = {fields}