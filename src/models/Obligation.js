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
    expired: {
        type: Boolean,
        default: false,
    },
    progress: {  // % de avance
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    startDate: {
        type: Date,
        required: true,
    },
    dueDate: {  // Fecha de vencimiento
        type: Date,
        required: true,
    },
    status: {  // Estado de la obligación
        type: String,
        enum: ['pendiente', 'en proceso', 'completada', 'atrasada'],
        default: 'pendiente',
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true,
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true,
    },
    area: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Area',
        required: true,
    },
    comments: [{
        text: {
            type: String,
            trim: true,
            required: true,
        },
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Member',
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
    reports: [{
        progress: {
            type: Number,
            min: 0,
            max: 100,
        },
        status: {
            type: String,
            enum: ['pendiente', 'en proceso', 'completada', 'atrasada'],
            default: 'pendiente',
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

/**
 * Middleware para actualizar automáticamente `completed`, `expired` y `status`
 */
obligationSchema.pre('save', function (next) {
    this.completed = this.progress === 100; // Si progreso es 100, completed será true
    this.expired = new Date() > this.dueDate && !this.completed; // Si está vencida y no completada, expired será true
    next();
});

// Transformación para incluir el campo `id` junto con `_id`
obligationSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        // delete ret._id;
        // delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Obligation', obligationSchema);