const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')
const { formatPrice, date } = require('../../lib/utils')

module.exports = {
    async index(req, res) {
        try {
            let products = await Product.findAll()

            if (!products) return res.send('Produtos não encontrados')

            async function getImage(productId) {
                let files = await Product.files(productId)
                files = files.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

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
        } catch (error) {
            console.error(error)
        }
    },

    async create(req, res) {
        try {
            const categories = await Category.findAll()
            return res.render("products/create.njk", { categories })

        } catch (error) {
            console.error(error)
        }
    },

    async store(req, res) {
        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == "")
                    return res.send('Por favor, preencha todos os campos.')
            }

            if (req.files.length == 0) {
                return res.send("Por favor, envie pelo menos uma imagem.")
            }

            let price = req.body.price.replace(/\D/g, "")

            const values = {
                category_id: req.body.category_id,
                user_id: req.session.userId,
                name: req.body.name,
                description: req.body.description,
                old_price: req.body.old_price || price,
                price,
                quantity: req.body.quantity,
                status: req.body.status || 1
            }

            const product_id = await Product.create(values)

            const filesPromise = req.files.map(file => File.create({name: file.filename,
                path: file.path, product_id }))
            await Promise.all(filesPromise)

            return res.redirect(`products/${product_id}/edit`)
        } catch (error) {
            console.error(error)
        }
    },

    async edit(req, res) {
        try {
            const product = await Product.find(req.params.id)

            if (!product) return res.send("Produto não encontrado")

            product.old_price = formatPrice(product.old_price)
            product.price = formatPrice(product.price)

            //get categories
            const categories = await Category.findAll()

            //get images
            let files = await Product.files(product.id)
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}
            `
            }))

            return res.render("products/edit", { product, categories, files })
        } catch (error) {
            console.error(error)
        }

    },

    async show(req, res) {
        try {

            const product = await Product.find(req.params.id)

            if (!product) return res.send("Produto não encontrado")

            const { day, month, hour, minutes } = date(product.updated_at)

            product.published = {
                day: `${day}/${month}`,
                hour: `${hour}:${minutes}`
            }

            product.oldPrice = formatPrice(product.old_price)
            product.price = formatPrice(product.price)

            let files = await Product.files(product.id)
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}
            `
            }))

            return res.render("products/show", { product, files })
        } catch (error) {
            console.error(error)
        }

    },

    async update(req, res) {
        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == "" && key != "removed_files")
                    return res.send('Por favor, preencha todos os campos.')
            }

            if (req.files.length != 0) {
                const newFilesPromise = req.files.map(file => File.create({ name: file.name,
                    path: file.path, product_id: req.body.id }))
                await Promise.all(newFilesPromise)
            }

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)

                const removedFilesPromise = removedFiles.map(id => File.delete(id))
                await Promise.all(removedFilesPromise)
            }

            req.body.price = req.body.price.replace(/\D/g, "")

            if (req.body.old_price != req.body.price) {
                const oldProduct = await Product.find(req.body.id)
                req.body.old_price = oldProduct.rows[0].price
            }

            const values = {
                category_id: req.body.category_id,                
                name: req.body.name,
                description: req.body.description,
                old_price: req.body.old_price,
                price: req.body.price,
                quantity: req.body.quantity,
                status: req.body.status    
            }

            await Product.update(req.body.id, values)

            return res.redirect(`/products/${req.body.id}`)
        } catch (error) {
            console.error(error)
        }

    },

    async destroy(req, res) {
        await Product.delete(req.body.id)

        return res.redirect('/products/create')
    }
}