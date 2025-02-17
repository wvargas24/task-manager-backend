require('dotenv').config();
const mongoose = require('mongoose');

// URL de conexión a MongoDB
const env = process.env.NODE_ENV || 'development'; // Por defecto será 'development'
const MONGO_URI = env === 'production' ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV;

// Conexión a MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Conectado a MongoDB en ${env} 🚀`);
    } catch (error) {
        console.error('Error conectando a MongoDB:', error.message);
        process.exit(1); // Salir del proceso si falla la conexión
    }
};

module.exports = connectDB;
