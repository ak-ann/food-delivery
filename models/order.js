'use strict';

const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
        }
    }

    Order.init(
        {
            customerName: {
                type: DataTypes.STRING,
                allowNull: false
            },

            phone: {
                type: DataTypes.STRING,
                allowNull: false
            },

            address: {
                type: DataTypes.STRING,
                allowNull: false
            },

            deliveryComment: {
                type: DataTypes.STRING,
                allowNull: true
            },

            restaurant: {
                type: DataTypes.STRING,
                allowNull: false
            },

            items: {
                type: DataTypes.JSON,
                allowNull: false
            },

            totalPrice: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },

            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'В обработке'
            }
        },
        {
            sequelize,
            modelName: 'Order',
            tableName: 'orders'
        }
    );

    return Order;
};