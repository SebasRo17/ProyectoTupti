const Factura = require('./Facturas');
const Pedido = require('./Pedido');
const User = require('./User');

const setupAssociations = () => {
    // Asociación entre Factura y Pedido
    Factura.belongsTo(Pedido, {
        foreignKey: 'id_pedido',
        targetKey: 'IdPedido',
        as: 'pedido',
        constraints: false // Importante: coincide con ON DELETE NO ACTION ON UPDATE NO ACTION
    });

    Pedido.hasOne(Factura, {
        foreignKey: 'id_pedido',
        sourceKey: 'IdPedido',
        as: 'factura',
        constraints: false
    });

    // Asociación entre Pedido y Usuario
    Pedido.belongsTo(User, {
        foreignKey: 'IdUsuario',
        targetKey: 'IdUsuario',
        as: 'usuario',
        onDelete: 'NO ACTION'
    });

    User.hasMany(Pedido, {
        foreignKey: 'IdUsuario',
        sourceKey: 'IdUsuario',
        as: 'pedidos',
        onDelete: 'NO ACTION'
    });
};

module.exports = setupAssociations;
