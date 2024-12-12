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

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS actualizada
const allowedOrigins = [
    'https://tupti.store',
    'https://www.tupti.store',
    'http://localhost:3000',
    'http://localhost:5173',
    'https://proyecto-tupti-vwl2-n68e6b66v-sebasro17s-projects.vercel.app',
    'https://proyecto-tupti-vwl2-nu4otzt8r-sebasro17s-projects.vercel.app',
    'https://proyectotupti.onrender.com'
];

app.use(cors({
    origin: [...allowedOrigins, /\.vercel\.app$/],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Access-Control-Allow-Origin']
}));

// Middleware mejorado para headers CORS
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
        if (allowedOrigins.includes(origin) || origin.match(/\.vercel\.app$/)) {
            res.header('Access-Control-Allow-Origin', origin);
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            res.header('Access-Control-Expose-Headers', 'Access-Control-Allow-Origin');
        }
    }

    // Manejar preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    next();
});

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
app.use('/api', categoryProductsRoutes); // Mover esta línea antes de otras rutas /api
app.use('/api', bestSellersRoutes);
app.use('/products', productsRoutes); // Agregar ruta de productos
app.use('/apiImg', productRoutes); // Esta línea ya configura la ruta correctamente
app.use('/api', calificacionRoutes);

// Sincronizar con la base de datos y iniciar el servidor
sequelize.sync()
.then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo: http://localhost:${PORT}`);
    //En caso de que el puerto 3000 este en uso, usar este comando para matar el proceso
    //npx kill-port 3000
    //SOLO EN AMBIENTE DE DESARRROLLO
    console.log(`Entorno: ${process.env.NODE_ENV}`);
    console.log(`URL de la base de datos: ${process.env.DATABASE_URL}`);
    console.log(`CORS habilitado para: ${process.env.FRONTEND_URL}`);
  });
})
.catch(error => {
  console.error('Error detallado:', error.stack);
});
