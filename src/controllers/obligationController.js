const Obligation = require('../models/Obligation');
const User = require('../models/Member');
const Branch = require('../models/Branch');
const Area = require('../models/Area');

// Obtener todas las tareas con detalles del usuario asignado
const getObligations = async (req, res) => {
    try {
        const obligations = await Obligation.find()
            .populate('assignedTo', 'name email image')
            .populate('branch') // Populate para el campo branch
            .populate('area') // Populate para el campo area
            .populate('comments.member', 'name email image')
            .populate('reports.reportedBy', 'name email image');
        res.json(obligations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear una nueva Obligacion
const createObligation = async (req, res) => {
    try {
        const { title, description, progress, startDate, dueDate, assignedTo, branch, area, comments } = req.body;

        // Verificar si el usuario, sucursal y área existen
        const userExists = await User.findById(assignedTo);
        const branchExists = await Branch.findById(branch);
        const areaExists = await Area.findById(area);

        if (!userExists) return res.status(400).json({ error: 'El usuario asignado no existe' });
        if (!branchExists) return res.status(400).json({ error: 'La sucursal no existe' });
        if (!areaExists) return res.status(400).json({ error: 'El área no existe' });

        // Crear la obligación
        const obligation = new Obligation({ title, description, progress, startDate, dueDate, assignedTo, branch, area, comments });
        await obligation.save();

        // Poblar los campos antes de devolver la respuesta
        const populatedObligation = await obligation.populate(['assignedTo', 'branch', 'area']);

        res.status(201).json(populatedObligation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar una Obligacion
const updateObligation = async (req, res) => {
    try {
        const { progress, dueDate, comments, branch, area } = req.body;

        if (branch) {
            const branchExists = await Branch.findById(branch);
            if (!branchExists) {
                return res.status(400).json({ error: 'La sucursal no existe' });
            }
        }

        if (area) {
            const areaExists = await Area.findById(area);
            if (!areaExists) {
                return res.status(400).json({ error: 'El área no existe' });
            }
        }

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


// Eliminar una Obligacion
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

// Agregar un reporte a una obligación
const addReportToObligation = async (req, res) => {
    try {
        const { progress, status, comment, reportedBy } = req.body;
        console.log("Archivo subido:", req.file);

        let documentUrl = ''; // Debe ser let para poder reasignarlo si hay un archivo
        if (req.file) {
            const allowedMimeTypes = ["application/pdf", "image/png", "image/jpeg"];
            if (!allowedMimeTypes.includes(req.file.mimetype)) {
                return res.status(400).json({ error: "Formato de archivo no permitido. Solo PDF, PNG y JPG son aceptados." });
            }
            documentUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            console.log("URL del documento:", documentUrl);
        }

        // Verificar si la obligación existe
        const obligation = await Obligation.findById(req.params.id);
        if (!obligation) {
            return res.status(404).json({ error: 'Obligación no encontrada' });
        }

        // Verificar si el usuario que reporta existe
        const userExists = await User.findById(reportedBy);
        if (!userExists) {
            return res.status(400).json({ error: 'El usuario que reporta no existe' });
        }

        // Create new report
        const newReport = {
            progress,
            status,
            comment,
            document: documentUrl || null,
            reportedBy,
            createdAt: new Date()
        };

        // Add the report to the obligation
        obligation.reports.push(newReport);

        // Update obligation status and progress
        if (progress !== undefined) {
            obligation.progress = progress;
            obligation.completed = progress === 100; // If progress is 100, set completed to true
        }

        if (status) {
            obligation.status = status; // Update status
        }

        // Verificar si la obligación está atrasada
        if (new Date() > obligation.dueDate && !obligation.completed) {
            obligation.expired = true;
            obligation.status = 'atrasada';
        }

        await obligation.save();

        // Hacer populate de los reportes
        const updatedObligation = await Obligation.findById(req.params.id)
            .populate('reports.reportedBy', 'name email image');

        res.status(201).json(updatedObligation);
    } catch (error) {
        console.error("Error al agregar reporte:", error);
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

const updateMultipleObligations = async (req, res) => {
    try {
        const { currentStatus, newStatus, area, branch } = req.body;

        if (!currentStatus || !newStatus) {
            return res.status(400).json({ error: "Debes proporcionar el estado actual y el nuevo estado." });
        }

        // Filtro: Obligaciones con el estado actual y sin área ni branch asignados
        const filter = {
            status: currentStatus,
            $or: [{ area: { $exists: false } }, { area: null }, { branch: { $exists: false } }, { branch: null }]
        };

        // Campos a actualizar
        const updateFields = { status: newStatus };
        if (area) updateFields.area = area;
        if (branch) updateFields.branch = branch;

        // Actualizar todas las obligaciones que cumplan con el filtro
        const result = await Obligation.updateMany(filter, { $set: updateFields });

        res.status(200).json({
            message: "Obligaciones actualizadas correctamente",
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getObligations,
    createObligation,
    updateObligation,
    updateMultipleObligations,
    deleteObligation,
    createMultipleObligations,
    addCommentToObligation,
    addReportToObligation
};