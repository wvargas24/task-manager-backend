const express = require('express');
const cors = require('cors');
const path = require('path'); // Importar path

const obligationRoutes = require('./routes/obligationRoutes');
const memberRoutes = require('./routes/memberRoutes');
const roleRoutes = require('./routes/roleRoutes');
const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');
const branchRoutes = require('./routes/branchRoutes');
const areaRoutes = require('./routes/areaRoutes');
const areaRoutes = require('./routes/areaRoutes');
require('dotenv').config(); // Cargar variables de entorno

const app = express();
app.use(cors());
// Middlewares
app.use(express.json()); // Para parsear cuerpos JSON
// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas
app.use('/api/obligations', obligationRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/areas', areaRoutes);

// Manejo de errores básicos
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Algo salió mal' });
});

app.get('/', (req, res) => {
    res.send('Welcome to the Task Manager API!');
});

module.exports = app;
