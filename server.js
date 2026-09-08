const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

let orders = [
    {
        id: 1,
        customerName: "Анна Иванова",
        phone: "+375291234567",
        address: "г. Минск, ул. Ленина, 10",
        restaurant: "Pizza House",
        items: ["Пицца Маргарита", "Кола"],
        totalPrice: 28.50,
        status: "В обработке"
    },
    {
        id: 2,
        customerName: "Иван Петров",
        phone: "+375331112233",
        address: "г. Минск, ул. Сурганова, 25",
        restaurant: "Burger City",
        items: ["Чизбургер", "Картофель фри"],
        totalPrice: 19.90,
        status: "Доставляется"
    },
    {
        id: 3,
        customerName: "Мария Смирнова",
        phone: "+375447778899",
        address: "г. Минск, пр. Победителей, 15",
        restaurant: "Sushi Time",
        items: ["Сет Филадельфия"],
        totalPrice: 35.00,
        status: "Доставлен"
    }
];

// GET /orders
// Получить список всех заказов
app.get('/orders', (req, res) => {
    res.status(200).json(orders);
});

// GET /orders/:id
// Получить один заказ по ID
app.get('/orders/:id', (req, res) => {
    const id = Number(req.params.id);

    const order = orders.find(order => order.id === id);

    if (!order) {
        return res.status(404).json({
            error: "Заказ не найден"
        });
    }

    res.status(200).json(order);
});

// POST /orders
// Создать новый заказ
app.post('/orders', (req, res) => {
    const {
        customerName,
        phone,
        address,
        restaurant,
        items,
        totalPrice,
        status
    } = req.body;

    // Проверяем обязательные поля
    if (
        !customerName ||
        !phone ||
        !address ||
        !restaurant ||
        !items ||
        totalPrice === undefined
    ) {
        return res.status(400).json({
            error: "Необходимо заполнить все обязательные поля"
        });
    }

    // Проверяем тип данных
    if (!Array.isArray(items)) {
        return res.status(400).json({
            error: "Поле items должно быть массивом"
        });
    }

    if (typeof totalPrice !== "number" || totalPrice < 0) {
        return res.status(400).json({
            error: "totalPrice должен быть неотрицательным числом"
        });
    }

    const newOrder = {
        id: orders.length > 0
            ? Math.max(...orders.map(order => order.id)) + 1
            : 1,
        customerName,
        phone,
        address,
        restaurant,
        items,
        totalPrice,
        status: status || "В обработке"
    };

    orders.push(newOrder);

    res.status(201).json(newOrder);
});

// PUT /orders/:id
// Полностью обновить заказ
app.put('/orders/:id', (req, res) => {
    const id = Number(req.params.id);

    const orderIndex = orders.findIndex(order => order.id === id);

    if (orderIndex === -1) {
        return res.status(404).json({
            error: "Заказ не найден"
        });
    }

    const {
        customerName,
        phone,
        address,
        restaurant,
        items,
        totalPrice,
        status
    } = req.body;

    // Проверяем обязательные поля
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
            error: "Для полного обновления необходимо указать все поля"
        });
    }

    if (!Array.isArray(items)) {
        return res.status(400).json({
            error: "Поле items должно быть массивом"
        });
    }

    if (typeof totalPrice !== "number" || totalPrice < 0) {
        return res.status(400).json({
            error: "totalPrice должен быть неотрицательным числом"
        });
    }

    orders[orderIndex] = {
        id,
        customerName,
        phone,
        address,
        restaurant,
        items,
        totalPrice,
        status
    };

    res.status(200).json(orders[orderIndex]);
});

// DELETE /orders/:id
// Удалить заказ
app.delete('/orders/:id', (req, res) => {
    const id = Number(req.params.id);

    const orderIndex = orders.findIndex(order => order.id === id);

    if (orderIndex === -1) {
        return res.status(404).json({
            error: "Заказ не найден"
        });
    }

    const deletedOrder = orders.splice(orderIndex, 1)[0];

    res.status(200).json({
        message: "Заказ успешно удалён",
        order: deletedOrder
    });
});

// Middleware для обработки неизвестных маршрутов
app.use((req, res) => {
    res.status(404).json({
        error: "Маршрут не найден"
    });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        error: "Внутренняя ошибка сервера"
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});