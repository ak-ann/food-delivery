require('dotenv').config();

const express = require('express');

const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

const orderRoutes = require('./routes/orderRoutes');

const authRoutes = require('./routes/auth');

app.use(express.json());

app.use('/orders', orderRoutes);

app.use('/auth', authRoutes);

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