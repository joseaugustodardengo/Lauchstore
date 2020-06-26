const fs = require('fs')
const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')
const LoadProductService = require('../services/LoadProductService')

module.exports = {
    async index(req, res) {
        try {

            const products = await LoadProductService.load('products')            

            if (!products) return res.send('Produtos não encontrados')

            return res.render("products/index.njk", { products })
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
            const product = await LoadProductService.load('product', {where: {id: req.params.id}})

            //get categories
            const categories = await Category.findAll()

            return res.render("products/edit", { product, categories, files:product.files })
        } catch (error) {
            console.error(error)
        }

    },

    async show(req, res) {
        try {

            const product = await LoadProductService.load('product', {where: {id: req.params.id}})            

            return res.render("products/show", { product, files: product.files })
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
                const newFilesPromise = req.files.map(file => File.create({ name: file.filename,
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
                req.body.old_price = oldProduct.price
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

        const files = await Product.files(req.body.id)

        await Product.delete(req.body.id)

        files.map(file => {
            try {
                fs.unlinkSync(file.path)                        
            } catch (error) {
                console.error(error)
            }

        })

        return res.redirect('/products/create')
    }
}