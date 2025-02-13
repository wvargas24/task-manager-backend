const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    logo: {
        type: String, // URL de la imagen del logo
        default: '', // Puede ser opcional o establecer un valor predeterminado
    }
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
