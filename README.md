# Proyecto de Gestión de Votantes

Este proyecto es una API para la gestión de votantes, candidatos y procesos relacionados, utilizando Node.js, Express y JWT para la autenticación. La documentación de las APIs está disponible en Swagger.

## Estructura del Proyecto
```
ELECTION-SYSTEM-BACK/
├── src/
│   ├── config/           # Configuracion base de datos y swagger.
│   │   ├── db.js
│   │   ├── swagger.js
│   ├── controllers/      # Lógica de negocio de la aplicación
│   │   ├── AdminController.js
│   │   ├── VotersController.js
│   │   ├── VotesController.js
│   ├── middleware/       # Middlewar de autenticación
│   │   ├── authMiddleware.js
│   ├── routes/           # Definición de rutas principales
│   │   ├── admin.routes.js
│   │   ├── voters.routes.js
│   │   ├── votes.routes.js
│   └── const/            # Constantes globales
├── package.json          # Dependencias del proyecto
└── README.md             # Información del proyecto
```

## Instrucciones de Instalación

Sigue estos pasos para instalar y ejecutar el proyecto localmente:

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/DamianEtcheverrigaray97/election-system-back.git
   cd election-system-back
   ```

2. **Instalar dependencias**:
   Asegúrate de tener Node.js y npm instalados. Luego ejecuta:
   ```bash
   npm install
   ```

## Pasos para Configurar el Entorno

1. **Base de Datos**:
- Para configurar la base de datos, puedes utilizar **XAMPP** como servidor MySQL local.
   - Una vez tengas **XAMPP** instalado, abre el panel de control y arranca el módulo **MySQL**.
   - Utiliza un gestor de base de datos como **DBeaver** para gestionar tu base de datos. Si no tienes **DBeaver**, puedes descargarlo desde [aquí](https://dbeaver.io/download/).
   - Crea una nueva base de datos llamada `electiondb` en el gestor de base de datos.
   - Luego, ejecuta el script SQL que se encuentra en el repositorio. Este archivo, llamado `database_schema.sql`, contiene la estructura completa de las tablas y los datos de prueba que se cargarán en la base de datos.

2. **Configurar el archivo `.env`**:
   - En la raíz de tu proyecto, crea un archivo llamado `.env` (si no existe).
   - Dentro del archivo `.env`, configura las siguientes variables:

   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=''
   DB_NAME=electiondb
   PORT=3000
   JWT_SECRET=xxxxxxx

## Comandos para Ejecutar el Servidor

- **Iniciar el servidor en modo desarrollo**:
  ```bash
  npm run dev
  ```

## Acceso a Swagger

Swagger está disponible para documentar las APIs del proyecto. Una vez que el servidor esté en ejecución, visita:
```
http://localhost:<puerto>/api-docs
```
Aquí encontrarás la documentación completa de las rutas y podrás interactuar con ellas directamente desde la interfaz.

## Información Adicional

- Asegúrate de que los puertos configurados en `.env` no estén en uso por otros servicios.
- Para problemas comunes o errores, revisa los logs del servidor que se generan al ejecutar el proyecto.

---
