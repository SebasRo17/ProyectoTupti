require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Agregar esta línea
const session = require('express-session');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('./config/swagger');
const userRoutes = require('./presentation/routes/userRoutes');
const authRoutes = require('./presentation/routes/authRoutes');
const productRoutes = require('./presentation/routes/prodImgRoutes');
const bestSellersRoutes = require('./presentation/routes/bestSellersRoutes');
const { sequelize } = require('./infrastructure/database/mysqlConnection');
require('./aplication/services/GoogleAuthService'); // Inicializar configuración de passport

const app = express();
const PORT = 3000;

// Configuración de CORS - Agregar estas líneas antes de otros middlewares
app.use(cors({
  origin: 'http://localhost:5173', // Ajusta esto según el puerto de tu frontend
  credentials: true
}));

// Configuración de sesión
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Configuración de middlewares y rutas
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig.swaggerSpec));
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/api', bestSellersRoutes);
app.use('/apiImg', productRoutes); // Esta línea ya configura la ruta correctamente

// Sincronizar con la base de datos y iniciar el servidor
sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error al sincronizar con la base de datos:', error);
  });