'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('orders', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            customerName: {
                type: Sequelize.STRING,
                allowNull: false
            },

            phone: {
                type: Sequelize.STRING,
                allowNull: false
            },

            address: {
                type: Sequelize.STRING,
                allowNull: false
            },

            restaurant: {
                type: Sequelize.STRING,
                allowNull: false
            },

            items: {
                type: Sequelize.JSON,
                allowNull: false
            },

            totalPrice: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },

            status: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'В обработке'
            },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },

            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('orders');
    }
};