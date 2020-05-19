const express = require('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer')
const ProductController = require('./app/controllers/ProductController')
const HomeController = require('./app/controllers/HomeController')
const SearchController = require('./app/controllers/SearchController')

//Home
routes.get("/", HomeController.index)

//Search
routes.get('/products/search', SearchController.index)

//Products
routes.get('/products', ProductController.index)
routes.get('/products/create', ProductController.create)
routes.get('/products/:id', ProductController.show)
routes.get('/products/:id/edit', ProductController.edit)
routes.post('/products', multer.array("photos", 6), ProductController.store)
routes.put('/products', multer.array("photos", 6), ProductController.update)
routes.delete('/products',ProductController.destroy)


//Alias
routes.get('/ads/create', function(req,res) {
    return res.redirect("/products/create")
})


module.exports = routes