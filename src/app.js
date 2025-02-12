const express = require('express');
const cors = require('cors');
const obligationRoutes = require('./routes/obligationRoutes');
const memberRoutes = require('./routes/memberRoutes');
const roleRoutes = require('./routes/roleRoutes');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config(); // Cargar variables de entorno

const app = express();
app.use(cors());
// Middlewares
app.use(express.json()); // Para parsear cuerpos JSON

// Rutas
app.use('/api/obligations', obligationRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/auth', authRoutes);

// Manejo de errores básicos
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Algo salió mal' });
});

app.get('/', (req, res) => {
    res.send('Welcome to the Task Manager API!');
});

module.exports = app;
