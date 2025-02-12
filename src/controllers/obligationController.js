const Obligation = require('../models/Obligation');
const User = require('../models/Member');

// Obtener todas las tareas con detalles del usuario asignado
const getObligations = async (req, res) => {
    try {
        const obligations = await Obligation.find().populate('assignedTo', 'name email image');
        res.json(obligations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear una nueva tarea
const createObligation = async (req, res) => {
    try {
        const { title, description, progress, startDate, endDate, assignedTo } = req.body;

        // Verificar si el usuario existe
        const userExists = await User.findById(assignedTo);
        if (!userExists) {
            return res.status(400).json({ error: 'El usuario asignado no existe' });
        }

        // Crear la tarea
        const obligation = new Obligation({ title, description, progress, startDate, endDate, assignedTo });
        await obligation.save();
        res.status(201).json(obligation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar una tarea
const updateObligation = async (req, res) => {
    try {
        const { progress, endDate } = req.body;

        // Si la fecha de vencimiento ya pasó y no está completa, cambiar estado a "vencida"
        if (endDate && new Date(endDate) < new Date()) {
            req.body.status = 'vencida';
        }

        // Si el progreso llega a 100%, marcar como completada
        if (progress === 100) {
            req.body.status = 'completada';
        }

        const obligation = await Obligation.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!obligation) return res.status(404).json({ error: 'Ogligación no encontrada' });

        res.json(obligation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar una tarea
const deleteObligation = async (req, res) => {
    try {
        const obligation = await Obligation.findByIdAndDelete(req.params.id);
        if (!obligation) return res.status(404).json({ error: 'Ogligación no encontrada' });

        res.json({ message: 'Ogligación eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createMultipleObligations = async (req, res) => {
    try {
        const { data } = req.body; // Se espera un array de obligaciones en el cuerpo de la solicitud

        if (!Array.isArray(data) || data.length === 0) {
            return res.status(400).json({ message: "Se requiere un array de obligaciones válido." });
        }

        const obligations = await Obligation.insertMany(data);

        return res.status(201).json({
            message: "Obligaciones creadas exitosamente.",
            obligations
        });

    } catch (error) {
        console.error("Error al crear múltiples obligaciones:", error);
        return res.status(500).json({ message: "Error interno del servidor.", error });
    }
};


module.exports = { getObligations, createObligation, updateObligation, deleteObligation, createMultipleObligations };
