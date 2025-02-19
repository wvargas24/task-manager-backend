const Obligation = require('../models/Obligation');
const User = require('../models/Member');
const Branch = require('../models/Branch'); // Asegúrate de importar el modelo Branch

// Obtener todas las tareas con detalles del usuario asignado
const getObligations = async (req, res) => {
    try {
        const obligations = await Obligation.find()
            .populate('assignedTo', 'name email image')
            .populate('branch') // Populate para el campo branch
            .populate('comments.member', 'name email image');
        res.json(obligations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear una nueva tarea
const createObligation = async (req, res) => {
    try {
        const { title, description, progress, startDate, endDate, assignedTo, branch, comments } = req.body;

        // Verificar si el usuario existe
        const userExists = await User.findById(assignedTo);
        if (!userExists) {
            return res.status(400).json({ error: 'El usuario asignado no existe' });
        }

        // Verificar si la sucursal existe
        const branchExists = await Branch.findById(branch);
        if (!branchExists) {
            return res.status(400).json({ error: 'La sucursal no existe' });
        }

        // Crear la tarea
        const obligation = new Obligation({ title, description, progress, startDate, endDate, assignedTo, branch, comments });
        await obligation.save();
        res.status(201).json(obligation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar una tarea
const updateObligation = async (req, res) => {
    try {
        const { progress, endDate, comments, branch } = req.body;

        // Si la fecha de vencimiento ya pasó y no está completa, cambiar estado a "vencida"
        if (endDate && new Date(endDate) < new Date()) {
            req.body.status = 'vencida';
        }

        // Si el progreso llega a 100%, marcar como completada
        if (progress === 100) {
            req.body.status = 'completada';
        }

        // Verificar si la sucursal existe (si se está actualizando)
        if (branch) {
            const branchExists = await Branch.findById(branch);
            if (!branchExists) {
                return res.status(400).json({ error: 'La sucursal no existe' });
            }
        }

        // Agregar comentarios si se incluyen en la solicitud
        if (comments && Array.isArray(comments)) {
            req.body.comments = comments;
        }

        const obligation = await Obligation.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!obligation) return res.status(404).json({ error: 'Obligación no encontrada' });

        res.json(obligation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar una tarea
const deleteObligation = async (req, res) => {
    try {
        const obligation = await Obligation.findByIdAndDelete(req.params.id);
        if (!obligation) return res.status(404).json({ error: 'Obligación no encontrada' });

        res.json({ message: 'Obligación eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Agregar un comentario a una obligación
const addCommentToObligation = async (req, res) => {
    try {
        const { commentText, memberId } = req.body;

        // Verificar si la obligación existe
        const obligation = await Obligation.findById(req.params.id);
        if (!obligation) {
            return res.status(404).json({ error: 'Obligación no encontrada' });
        }

        // Verificar si el miembro existe
        const memberExists = await User.findById(memberId);
        if (!memberExists) {
            return res.status(400).json({ error: 'El miembro no existe' });
        }

        // Crear el comentario
        const newComment = {
            text: commentText,
            member: memberId,
            createdAt: new Date()
        };

        // Agregar el comentario a la obligación
        obligation.comments.push(newComment);
        await obligation.save();

        // Hacer populate de los comentarios, para traer los datos completos del miembro
        const populatedObligation = await Obligation.findById(req.params.id)
            .populate('comments.member', 'name email image');  // Populate de miembro en los comentarios

        res.status(201).json(populatedObligation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Crear múltiples obligaciones
const createMultipleObligations = async (req, res) => {
    try {
        const { data } = req.body; // Se espera un array de obligaciones en el cuerpo de la solicitud

        if (!Array.isArray(data) || data.length === 0) {
            return res.status(400).json({ message: "Se requiere un array de obligaciones válido." });
        }

        // Verificar que todas las obligaciones tengan un branch válido
        for (const obligation of data) {
            const branchExists = await Branch.findById(obligation.branch);
            if (!branchExists) {
                return res.status(400).json({ error: `La sucursal con ID ${obligation.branch} no existe` });
            }
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

module.exports = {
    getObligations,
    createObligation,
    updateObligation,
    deleteObligation,
    createMultipleObligations,
    addCommentToObligation
};