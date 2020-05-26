const db = require('../../config/db')

module.exports = {
    async findOne(filters) {
        try {
            let query = `SELECT * FROM users`

            Object.keys(filters).map(key => {
                query = `${query} 
                ${key}
                `
                Object.keys(filters[key]).map(field => {
                    query = `${query} ${field} = '${filters[key][field]}' `
                })
            })
            
            const results = await db.query(query)
            
            return results.rows[0]
        } catch (error) {
            console.error(error)
        }
    },

    async create(data) {
        try {
            const query = `INSERT INTO users (
                name,
                email,
                password,
                cpf_cnpj,
                cep,
                address
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id`
        
            const results = await db.query(query, data)
            return results.rows[0].id
        } catch (error) {
            console.error(error)
        }
    }
}