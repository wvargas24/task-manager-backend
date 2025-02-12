const express = require('express');
const obligationsRoutes = require('./routes/obligations');

const app = express();

// Middleware para procesar JSON
app.use(express.json());

// Rutas
app.use('/api/obligations', obligationsRoutes);

// Ruta inicial de prueba
app.get('/', (req, res) => {
    res.send('¡Bienvenido al API de Gestión de Tareas! test 2');
});

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware para manejar errores generales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal' });
});

// Configurar puerto y ejecutar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
