const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Cargar variables de entorno

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("⚠️ No se encontró MONGO_URI en las variables de entorno");
    process.exit(1);
}

// Conexión a MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Conectado a MongoDB');
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
