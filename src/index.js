const express = require('express');
const globalConstants = require('./const/globalConstants');
const bodyParser = require('body-parser');
routerConfig = require('./routes/index.routes');
require('./config/db'); // Inicia la conexión a la base de datos
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');

const apiConfig = (app) => {
    app.use(bodyParser.json());
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    return;
} 

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