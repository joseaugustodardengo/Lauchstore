const express = require('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer')
const ProductController = require('./app/controllers/ProductController')

routes.get("/", function(req,res){
    return res.render('layout.njk')
})

routes.get('/products/create', ProductController.create)
routes.get('/products/:id/edit', ProductController.edit)
routes.post('/products', multer.array("photos", 6), ProductController.store)
routes.put('/products', multer.array("photos", 6), ProductController.update)
routes.delete('/products',ProductController.destroy)

//Alias
routes.get('/ads/create', function(req,res) {
    return res.redirect("/products/create")
})


module.exports = routes