const { DataTypes } = require('sequelize');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');
const Pedido = require('./Pedido');

const Factura = sequelize.define('Factura', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_pedido: {
        type: DataTypes.INTEGER,
        references: {
            model: Pedido,
            key: 'IdPedido'
        }
    },
    pdf_data: {
        type: DataTypes.BLOB('medium')
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    estado: {
        type: DataTypes.STRING(50)
    },
    email_enviado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    fecha_envio: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'facturas',
    timestamps: false
});

module.exports = Factura;
