const http = require('http');
const app = require('./src/app'); // Importa la configuración de la app
const connectDB = require('./src/config/db'); // Importa la configuración de MongoDB

// Conectar a la base de datos
connectDB();

// Configuración del puerto
const PORT = process.env.PORT || 3000;

// Crear el servidor y escucharlo
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
