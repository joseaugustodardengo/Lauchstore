const Cart = require('../../lib/cart')
const LoadProductService = require('../services/LoadProductService')
const { addOne, removeOne } = require('../../lib/cart')

module.exports = {
    async index(req, res) {
        try {           

            let { cart } = req.session

            cart = Cart.init(cart)

            return res.render("cart/index", { cart })
        } catch (error) {
            console.error(error)
        }

    },

    async addOne(req,res) {
        try {
            const {id} = req.params

            const product = await LoadProductService.load('product', {where: {id}})

            let { cart } = req.session

            req.session.cart = Cart.init(cart).addOne(product)

            return res.redirect('/cart')

        } catch (error) {
            console.error(error)
        }
    },

    removeOne(req, res) {
        try {
            const {id} = req.params

            let { cart } = req.session
            
            if(!cart) return res.redirect('/cart')

            req.session.cart = Cart.init(cart).removeOne(id)

            return res.redirect('/cart')

        } catch (error) {
            console.error(error)
        }
    },
    
    delete(req,res) {
        try {

            const {id} = req.params

            let { cart } = req.session
            
            if(!cart) return res.redirect('/cart')

            req.session.cart = Cart.init(cart).delete(id)

            return res.redirect('/cart')
        } catch (error) {
            console.error(error)
        }
        
    }

}