const Category = require('../models/Category')
const Product = require('../models/Product')

module.exports = {
    async create(req,res) {
        //Pegar categorias
        const results = await Category.all()        
        const categories = results.rows;            
        return res.render("products/create.njk", { categories })
    },    

    async store(req,res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "")
                return res.send('Please, fill all fields')
        }

        req.body.price = req.body.price.replace(/\D/g,"")
        const values = [        
            req.body.category_id,
            req.body.user_id || 1,
            req.body.name,
            req.body.description,
            req.body.old_price || req.body.price,
            req.body.price,
            req.body.quantity,
            req.body.status || 1
        ]

        let results = await Product.create(values)
        const productId = results.rows[0].id

        results = await Category.all()
        const categories = results.rows
        
        return res.render("products/create.njk", { productId ,categories })
    }
}