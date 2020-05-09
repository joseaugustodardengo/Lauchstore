const Category = require('../models/Category')
const Product = require('../models/Product')
const { formatPrice } = require('../../lib/utils')

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
        
        return res.redirect(`products/${productId}/edit`)
    },

    async edit(req, res) {

        let results = await Product.find(req.params.id)
        const product = results.rows[0]

        if(!product) return res.send("Produto não encontrado")

        product.old_price = formatPrice(product.old_price)
        product.price = formatPrice(product.price)

        results = await Category.all()
        const categories = results.rows
        
        return res.render("products/edit.njk",{ product, categories })
    },

    async update(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "")
                return res.send('Please, fill all fields')
        }

        req.body.price = req.body.price.replace(/\D/g,"")
        
        if(req.body.old_price != req.body.price){
            const oldProduct = await Product.find(req.body.id)
            req.body.old_price = oldProduct.rows[0].price
        }

        const values = [        
            req.body.category_id,
            req.body.user_id || 1,
            req.body.name,
            req.body.description,
            req.body.old_price || req.body.price,
            req.body.price,
            req.body.quantity,
            req.body.status || 1,
            req.body.id
        ]

        await Product.update(values)

        return res.redirect(`/products/${req.body.id}/edit`)
    },

    async destroy(req, res) {
        await Product.delete(req.body.id)
        
        return res.redirect('/products/create')
    }
}