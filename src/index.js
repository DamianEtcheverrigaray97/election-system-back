const express = require('express');
const globalConstants = require('./const/globalConstants');
const bodyParser = require('body-parser');
routerConfig = require('./routes/index.routes');
require('./config/db'); // Inicia la conexión a la base de datos
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');
const cors = require('cors');

const apiConfig = (app) => {
    app.use(cors(corsOptions));
    app.use(bodyParser.json());
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    return;
} 

const corsOptions = {
    origin: 'http://localhost:4200',  // Permitir solicitudes solo desde este origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization', 'token'],  // Encabezados permitidos
};

const routesConfig = (app) => {
    app.use('/api/', routerConfig.routes_init());
}

const init = () => {
    const app = express();
    
    apiConfig(app);
    routesConfig(app);

    app.listen(globalConstants.PORT, () => {
        console.log(`Corriendo en http://localhost:${globalConstants.PORT}`);
    });
}

init();