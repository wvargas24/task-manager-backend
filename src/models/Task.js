const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
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
    dueDate: {  // Fecha de vencimiento
        type: Date,
        required: true,
    },
    status: {  // Estado de la tarea
        type: String,
        enum: ['pendiente', 'completada', 'vencida'],
        default: 'pendiente',
    },
    assignedTo: {  // Responsable de la tarea
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
