const { Order } = require('../models');

// GET /orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll();

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Ошибка при получении заказов'
        });
    }
};

// GET /orders/:id
exports.getOrderById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({
                error: 'Заказ не найден'
            });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Ошибка при получении заказа'
        });
    }
};

// POST /orders
exports.createOrder = async (req, res) => {
    try {
        const {
            customerName,
            phone,
            address,
            restaurant,
            items,
            totalPrice,
            status
        } = req.body;

        if (
            !customerName ||
            !phone ||
            !address ||
            !restaurant ||
            !items ||
            totalPrice === undefined
        ) {
            return res.status(400).json({
                error: 'Необходимо заполнить все обязательные поля'
            });
        }

        if (!Array.isArray(items)) {
            return res.status(400).json({
                error: 'Поле items должно быть массивом'
            });
        }

        if (
            typeof totalPrice !== 'number' ||
            totalPrice < 0
        ) {
            return res.status(400).json({
                error: 'totalPrice должен быть неотрицательным числом'
            });
        }

        const newOrder = await Order.create({
            customerName,
            phone,
            address,
            restaurant,
            items,
            totalPrice,
            status: status || 'В обработке'
        });

        res.status(201).json(newOrder);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Ошибка при создании заказа'
        });
    }
};

// PUT /orders/:id
exports.updateOrder = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({
                error: 'Заказ не найден'
            });
        }

        const {
            customerName,
            phone,
            address,
            deliveryComment,
            restaurant,
            items,
            totalPrice,
            status
        } = req.body;

        if (
            !customerName ||
            !phone ||
            !address ||
            !restaurant ||
            !items ||
            totalPrice === undefined ||
            !status
        ) {
            return res.status(400).json({
                error: 'Для полного обновления необходимо указать все поля'
            });
        }

        if (!Array.isArray(items)) {
            return res.status(400).json({
                error: 'Поле items должно быть массивом'
            });
        }

        if (
            typeof totalPrice !== 'number' ||
            totalPrice < 0
        ) {
            return res.status(400).json({
                error: 'totalPrice должен быть неотрицательным числом'
            });
        }

        await order.update({
            customerName,
            phone,
            address,
            deliveryComment,
            restaurant,
            items,
            totalPrice,
            status
        });

        res.status(200).json(order);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Ошибка при обновлении заказа'
        });
    }
};

// DELETE /orders/:id
exports.deleteOrder = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({
                error: 'Заказ не найден'
            });
        }

        await order.destroy();

        res.status(200).json({
            message: 'Заказ успешно удалён',
            order
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Ошибка при удалении заказа'
        });
    }
};