const mongoose = require('mongoose');

// URL de conexión a MongoDB
const MONGO_URI = process.env.MONGO_URI || MONGO_URI_DEV;

// Conexión a MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error.message);
        process.exit(1); // Salir del proceso si falla la conexión
    }
};

module.exports = connectDB;
