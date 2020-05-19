const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')
const { formatPrice, date } = require('../../lib/utils')

module.exports = {
    async index(req, res) {
        const results = await Product.all()
        let products = results.rows

        if(!products) return res.send('Produtos não encontrados')

        async function getImage(productId) {
            let results = await Product.files(productId)            
            let files = results.rows
            files = files.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`)

            return files[0]
        }

        const productsPromise = products.map(async product => {
            product.img = await getImage(product.id)
            product.oldPrice = formatPrice(product.old_price)
            product.price = formatPrice(product.price)

            return product
        })

        const items = await Promise.all(productsPromise)

        return res.render("products/index.njk", { products: items })
    },

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
                return res.send('Por favor, preencha todos os campos.')
        }

        if(req.files.length == 0){
            return res.send("Por favor, envie pelo menos uma imagem.")
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
        
        const filesPromise = req.files.map(file => File.create({...file, product_id: productId }))
        await Promise.all(filesPromise)

        return res.redirect(`products/${productId}/edit`)
    },

    async edit(req, res) {

        let results = await Product.find(req.params.id)
        const product = results.rows[0]

        if(!product) return res.send("Produto não encontrado")

        product.old_price = formatPrice(product.old_price)
        product.price = formatPrice(product.price)

        //get categories
        results = await Category.all()
        const categories = results.rows

        //get images
        results = await Product.files(product.id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}
            `
        }))
        
        return res.render("products/edit.njk",{ product, categories, files })
    },
    async show(req, res) {
        let results = await Product.find(req.params.id)
        const product = results.rows[0]

        if(!product) return res.send("Produto não encontrado")
        
        const { day, month,  hour, minutes } = date(product.updated_at)

        product.published = {
            day: `${day}/${month}`,
            hour: `${hour}:${minutes}`           
        }

        product.oldPrice = formatPrice(product.old_price)
        product.price = formatPrice(product.price)

        results = await Product.files(product.id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}
            `
        }))

        return res.render("products/show", { product, files })
    },

    async update(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files")
                return res.send('Por favor, preencha todos os campos.')
        }

        if(req.files.length != 0) {
            const newFilesPromise = req.files.map(file => File.create({...file, product_id:req.body.id}))
            await Promise.all(newFilesPromise)
        }

        if(req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",")
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1)

            const removedFilesPromise = removedFiles.map(id => File.delete(id))
            await Promise.all(removedFilesPromise)
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

        return res.redirect(`/products/${req.body.id}`)
    },

    async destroy(req, res) {
        await Product.delete(req.body.id)
        
        return res.redirect('/products/create')
    }
}