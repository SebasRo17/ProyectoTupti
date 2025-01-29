const { DataTypes } = require('sequelize');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');

const Factura = sequelize.define('Factura', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_pedido: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'pedido',
            key: 'IdPedido'
        }
    },
    pdf_data: {
        type: DataTypes.BLOB('medium'),
        allowNull: true
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    estado: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    email_enviado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    fecha_envio: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'facturas',
    timestamps: false
});

module.exports = Factura;
