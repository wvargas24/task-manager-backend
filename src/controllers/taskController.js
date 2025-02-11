const Task = require('../models/Task');
const User = require('../models/User');

// Obtener todas las tareas con detalles del usuario asignado
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate('assignedTo', 'firstName lastName email avatar');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear una nueva tarea
const createTask = async (req, res) => {
    try {
        const { title, description, progress, dueDate, assignedTo } = req.body;

        // Verificar si el usuario existe
        const userExists = await User.findById(assignedTo);
        if (!userExists) {
            return res.status(400).json({ error: 'El usuario asignado no existe' });
        }

        // Crear la tarea
        const task = new Task({ title, description, progress, dueDate, assignedTo });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar una tarea
const updateTask = async (req, res) => {
    try {
        const { progress, dueDate } = req.body;

        // Si la fecha de vencimiento ya pasó y no está completa, cambiar estado a "vencida"
        if (dueDate && new Date(dueDate) < new Date()) {
            req.body.status = 'vencida';
        }

        // Si el progreso llega a 100%, marcar como completada
        if (progress === 100) {
            req.body.status = 'completada';
        }

        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });

        res.json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar una tarea
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });

        res.json({ message: 'Tarea eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
