const express = require('express')
const routes = express.Router()

const CartController = require('../app/controllers/CartController')

const { isLoggedRedirectToUsers, onlyUsers } = require('../app/middlewares/session')

// // login/logout 
routes.get('/', CartController.index)






module.exports = routes