require('dotenv').config();

const express = require('express');

const app = express();

const PORT = 3000;

const orderRoutes = require('./routes/orderRoutes');

app.use(express.json());

app.use('/orders', orderRoutes);

app.use((req, res) => {
    res.status(404).json({
        error: 'Маршрут не найден'
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        error: 'Внутренняя ошибка сервера'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});