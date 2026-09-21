'use strict';

module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert('orders', [
            {
                customerName: 'Анна Иванова',
                phone: '+375291234567',
                address: 'г. Минск, ул. Ленина, 10',
                restaurant: 'Pizza House',
                items: JSON.stringify([
                    'Пицца Маргарита',
                    'Кола'
                ]),
                totalPrice: 28.50,
                status: 'В обработке',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                customerName: 'Иван Петров',
                phone: '+375331112233',
                address: 'г. Минск, ул. Сурганова, 25',
                restaurant: 'Burger City',
                items: JSON.stringify([
                    'Чизбургер',
                    'Картофель фри'
                ]),
                totalPrice: 19.90,
                status: 'Доставляется',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                customerName: 'Мария Смирнова',
                phone: '+375447778899',
                address: 'г. Минск, пр. Победителей, 15',
                restaurant: 'Sushi Time',
                items: JSON.stringify([
                    'Сет Филадельфия'
                ]),
                totalPrice: 35.00,
                status: 'Доставлен',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('orders', null, {});
    }
};