const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    image: {
        type: String,  // Se puede generar con Gravatar si lo deseas
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
