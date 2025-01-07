const { sequelize } = require('../../infrastructure/database/mysqlConnection');
const Pago = require('../../domain/models/paymentModel');

const PaymentRepository = {
    async create(paymentData) {
        try {
            return await Pago.create({
                IdOrdenPaypal: paymentData.IdOrdenPaypal,
                Monto: paymentData.Monto,
                IdPedido: paymentData.IdPedido,
                Estado: 'CREADO'
            });
        } catch (error) {
            console.error('Error al crear pago:', error);
            throw error;
        }
    },

    async findByPaypalOrderId(orderId) {
        try {
            return await Pago.findOne({ 
                where: { IdOrdenPaypal: orderId }
            });
        } catch (error) {
            console.error('Error al buscar pago:', error);
            throw error;
        }
    },

    async updateStatus(idOrdenPaypal, estado, transaction = null) {
        try {
            return await Pago.update(
                { Estado: estado },
                { 
                    where: { IdOrdenPaypal: idOrdenPaypal },
                    transaction
                }
            );
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            throw error;
        }
    }
};

module.exports = PaymentRepository;