const express = require('express');
const swaggerUi = require('swagger-ui-express'); // Importa swagger-ui-express
const swaggerConfig = require('./config/swagger');
const userRoutes = require('./presentation/routes/userRoutes');
const productRoutes = require('./presentation/routes/prodImgRoutes');
const { sequelize } = require('./infrastructure/database/mysqlConnection');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig.swaggerSpec));
app.use('/users', userRoutes);

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