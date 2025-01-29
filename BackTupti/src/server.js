require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const configurePassport = require('./config/passport'); // Asegúrate de tener este archivo configurado
const authRoutes = require('./presentation/routes/authRoutes');
const userRoutes = require('./presentation/routes/userRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('./config/swagger');
const productRoutes = require('./presentation/routes/prodImgRoutes');
const bestSellersRoutes = require('./presentation/routes/bestSellersRoutes');
const categoryProductsRoutes = require('./presentation/routes/categoryProductsRoutes');
const { sequelize } = require('./infrastructure/database/mysqlConnection');
require('./aplication/services/GoogleAuthService'); // Inicializar configuración de Google Auth
require('./aplication/services/FacebookAuthService'); // Inicializar configuración de Facebook Auth
const productsRoutes = require('./presentation/routes/productRoutes'); // Corregir importación
const calificacionRoutes = require('./presentation/routes/calificacionRoutes');
const carritoRoutes = require('./presentation/routes/carritoRoutes');
const paymentRoutes = require('./presentation/routes/paymentRoutes');
const pedidoRoutes = require('./presentation/routes/PedidoRoutes');
const direccionRoutes = require('./presentation/routes/direccionRoutes'); // Corregir importación de rutas de direcciones
const passwordResetRoutes = require('./presentation/routes/passwordResetRoutes'); // Agregar importación de rutas de reset de contraseña
const descuentoRoutes = require('./presentation/routes/descuentoRoutes');
const facturaEmailRoutes = require('./presentation/routes/facturaEmailRoutes');
const stockRoutes = require('./presentation/routes/stockRoutes'); 
const carritoDetalleRoutes = require('./presentation/routes/carritoDetalleRoutes'); // Agregar importación de rutas de carritoDetalle
const KardexProductRoutes = require('./presentation/routes/KardexProductRoutes');
const productDetailsRoutes = require('./presentation/routes/productDetailsRoutes');
const tipoProductoRoutes = require('./presentation/routes/TipoProductoRoutes');
const impuestoRoutes = require('./presentation/routes/ImpuestoRoutes');
const productoImagenRoutes = require('./presentation/routes/ProductoImagenRoutes');
const facturaRoutes = require('./presentation/routes/facturaRoutes');
const setupAssociations = require('./domain/models/associations');
const authMiddleware = require('./middleware/authMiddleware');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://tupti.store', 'https://www.tupti.store'] 
    : ['http://localhost:5173'],
  credentials: true
};

app.use(cors(corsOptions));

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Configurar Passport
configurePassport();

// Configuración de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig.swaggerSpec));
app.use('/users', userRoutes); 
app.use('/auth', authRoutes);
app.use('/api', categoryProductsRoutes); // Mover esta línea antes de otras rutas /api
app.use('/api', bestSellersRoutes);
app.use('/products', productsRoutes); // Agregar ruta de productos
app.use('/apiImg', productRoutes); // Esta línea ya configura la ruta correctamente
app.use('/api', calificacionRoutes);
app.use('/carrito', carritoRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/direcciones', direccionRoutes); // Agregar rutas de direcciones
app.use('/auth', passwordResetRoutes); // Agregar esta línea
app.use('/descuentos', descuentoRoutes);
app.use('/facturas', facturaEmailRoutes);
app.use('/api/stock', stockRoutes); 
app.use('/carrito-detalle', carritoDetalleRoutes); 
app.use('/kardex-product', KardexProductRoutes);
app.use('/product-details', productDetailsRoutes); 
app.use('/tipoproductos', tipoProductoRoutes);
app.use('/impuestos', impuestoRoutes);
app.use('/producto-imagen', productoImagenRoutes);

// Middleware de autenticación para rutas protegidas
app.use('/factura', authMiddleware);
app.use('/factura', facturaRoutes);

// Configurar las asociaciones
setupAssociations();

// Sincronizar con la base de datos y iniciar el servidor
sequelize.sync()
.then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo: http://localhost:${PORT}`);
    // En caso de que el puerto 3000 esté en uso, usar este comando para matar el proceso
    // npx kill-port 3000
    // SOLO EN AMBIENTE DE DESARROLLO
    console.log(`Entorno: ${process.env.NODE_ENV}`);
    console.log(`URL de la base de datos: ${process.env.DATABASE_URL}`);
    console.log(`CORS habilitado para: ${corsOptions.origin.join(', ')}`);
  });
})
.catch(error => {
  console.error('Error detallado:', error.stack);
});