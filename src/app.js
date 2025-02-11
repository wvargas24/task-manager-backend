const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
require('dotenv').config(); // Cargar variables de entorno

const app = express();
app.use(cors());
// Middlewares
app.use(express.json()); // Para parsear cuerpos JSON

// Rutas
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);

// Manejo de errores básicos
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Algo salió mal' });
});

app.get('/', (req, res) => {
    res.send('Welcome to the Task Manager API!');
});

module.exports = app;
