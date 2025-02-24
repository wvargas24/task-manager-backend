require('dotenv').config();
const OpenAI = require("openai");

// Crea una instancia del cliente de OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Usa tu clave de API desde las variables de entorno
});

module.exports = openai;