const mongoose = require('mongoose');

const obligationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    progress: {  // % de avance
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    startDate: {  // Fecha de vencimiento
        type: Date,
        required: true,
    },
    endDate: {  // Fecha de vencimiento
        type: Date,
        required: true,
    },
    status: {  // Estado de la obligación
        type: String,
        enum: ['sin iniciar', 'completada', 'vencida'],
        default: 'sin iniciar',
    },
    assignedTo: {  // Responsable de la obligación
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true,
    },
    branch: {  // Sucursal a la que pertenece la obligación
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true,
    },
    area: {  // Area a la que pertenece la obligación
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Area',
        required: true,
    },
    comments: [{
        text: {  // Texto del comentario
            type: String,
            trim: true,
            required: true,  // Asegúrate de que no se pueda agregar un comentario vacío
        },
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Member',
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,  // Se asigna la fecha automáticamente al crear el comentario
        },
    }],
    reports: [{  // Historial de reportes de la obligación
        progress: {
            type: Number,
            min: 0,
            max: 100,
        },
        status: {
            type: String,
            enum: ['sin iniciar', 'completada', 'vencida'],
        },
        comment: {
            type: String,
            trim: true,
        },
        document: {
            type: String, // Se guardará la URL del documento subido
        },
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Member',
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
}, { timestamps: true });

module.exports = mongoose.model('Obligation', obligationSchema);
