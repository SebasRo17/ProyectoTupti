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
const { sequelize } = require('./infrastructure/database/mysqlConnection');
require('./aplication/services/GoogleAuthService'); // Inicializar configuración de Google Auth
require('./aplication/services/FacebookAuthService'); // Inicializar configuración de Facebook Auth

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS
app.use(cors({
    origin: ['https://tupti.store', 'http://localhost:3000'],
    credentials: true
}));

// Middlewares
app.use(express.json());
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
app.use('/api', bestSellersRoutes);
app.use('/apiImg', productRoutes); // Esta línea ya configura la ruta correctamente


// Sincronizar con la base de datos y iniciar el servidor
sequelize.sync()
.then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`Entorno: ${process.env.NODE_ENV}`);
    console.log(`URL de la base de datos: ${process.env.DATABASE_URL}`);
    console.log(`CORS habilitado para: ${process.env.FRONTEND_URL}`);
  });
})
.catch(error => {
  console.error('Error detallado:', error.stack);
});
