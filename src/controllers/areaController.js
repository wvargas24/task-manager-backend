const Area = require('../models/Area');

// Obtener todas las áreas
const getAreas = async (req, res) => {
    try {
        const areas = await Area.find();
        res.json(areas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear una nueva área
const createArea = async (req, res) => {
    try {
        const { name, description } = req.body;
        const area = new Area({ name, description });
        await area.save();
        res.status(201).json(area);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar un área
const updateArea = async (req, res) => {
    try {
        const area = await Area.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!area) return res.status(404).json({ error: 'Área no encontrada' });

        res.json(area);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un área
const deleteArea = async (req, res) => {
    try {
        const area = await Area.findByIdAndDelete(req.params.id);
        if (!area) return res.status(404).json({ error: 'Área no encontrada' });

        res.json({ message: 'Área eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear múltiples áreas
const createMultipleAreas = async (req, res) => {
    try {
        const areas = req.body.areas; // Esperamos un array de objetos [{ name, description }, { name, description }]

        if (!Array.isArray(areas) || areas.length === 0) {
            return res.status(400).json({ error: 'Debe proporcionar un array de áreas' });
        }

        // Validar que los nombres no estén duplicados en la BD
        const existingAreas = await Area.find({ name: { $in: areas.map(area => area.name) } });
        if (existingAreas.length > 0) {
            const existingNames = existingAreas.map(area => area.name);
            return res.status(400).json({ error: `Las siguientes áreas ya existen: ${existingNames.join(', ')}` });
        }

        // Crear las áreas en la base de datos
        const newAreas = await Area.insertMany(areas);
        res.status(201).json(newAreas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getAreas,
    createArea,
    createMultipleAreas,
    updateArea,
    deleteArea
};
