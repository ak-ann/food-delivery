const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models');
const authMiddleware = require('../middleware/auth');

const router = express.Router();


// =========================
// РЕГИСТРАЦИЯ
// POST /auth/register
// =========================

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email и пароль обязательны'
            });
        }

        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({
                error: 'Пользователь с таким email уже существует'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            passwordHash,
            role: 'user'
        });

        res.status(201).json({
            message: 'Пользователь зарегистрирован',
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


// =========================
// ВХОД
// POST /auth/login
// =========================

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email и пароль обязательны'
            });
        }

        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({
                error: 'Неверный email или пароль'
            });
        }

        const passwordValid = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordValid) {
            return res.status(401).json({
                error: 'Неверный email или пароль'
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        res.json({
            message: 'Вход выполнен успешно',
            token
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


// =========================
// ПРОФИЛЬ
// GET /auth/profile
// =========================

router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'email', 'role']
        });

        if (!user) {
            return res.status(404).json({
                error: 'Пользователь не найден'
            });
        }

        res.json(user);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


// Экспорт роутера
module.exports = router;