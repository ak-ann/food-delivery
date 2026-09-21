'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn(
            'orders',
            'deliveryComment',
            {
                type: Sequelize.STRING,
                allowNull: true
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.removeColumn(
            'orders',
            'deliveryComment'
        );
    }
};