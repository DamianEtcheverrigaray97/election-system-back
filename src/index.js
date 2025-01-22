const express = require('express');
const globalConstants = require('./const/globalConstants');
const bodyParser = require('body-parser');
routerConfig = require('./routes/index.routes');
require('./config/db'); // Inicia la conexión a la base de datos

const apiConfig = (app) => {
    app.use(bodyParser.json());

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