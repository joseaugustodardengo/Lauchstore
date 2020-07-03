const express = require('express')
const routes = express.Router()
const OrderController = require('../app/controllers/OrderController')

const { onlyUsers } = require('../app/middlewares/session')


routes.get('/', onlyUsers, OrderController.index)
routes.get('/sales', onlyUsers, OrderController.sales)
routes.get('/:id', onlyUsers, OrderController.show)
routes.post('/', onlyUsers, OrderController.store)


module.exports = routes