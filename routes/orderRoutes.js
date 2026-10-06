const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.get(
    '/',
    authMiddleware,
    isAdmin,
    orderController.getAllOrders
);

router.get('/:id', orderController.getOrderById);

router.post('/', orderController.createOrder);

router.put('/:id', orderController.updateOrder);

router.delete('/:id', orderController.deleteOrder);

module.exports = router;