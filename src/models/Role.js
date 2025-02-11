const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    permissions: {
        type: [String],  // Lista de permisos asignados al rol
        default: [],
    }
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
