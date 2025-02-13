const Branch = require('../models/Branch');

// Obtener todas las sucursales
const getBranches = async (req, res) => {
    try {
        const branches = await Branch.find();
        res.json(branches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single branch by ID
const getBranchById = async (req, res) => {
    try {
        const branch = await Branch.findById(req.params.id);
        if (!branch) {
            return res.status(404).json({ message: 'Branch not found' });
        }
        res.status(200).json(branch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear una nueva sucursal
const createBranch = async (req, res) => {
    try {
        const { name, image, location } = req.body;

        // Verificar que la ubicación tenga latitud y longitud
        if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
            return res.status(400).json({ error: 'Ubicación inválida. Se requieren latitud y longitud numéricas.' });
        }

        const branch = new Branch({ name, image, location });
        await branch.save();

        res.status(201).json({ message: 'Sucursal creada exitosamente', branch });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar una sucursal
const updateBranch = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image, location } = req.body;

        // Verificar si la sucursal existe
        let branch = await Branch.findById(id);
        if (!branch) {
            return res.status(404).json({ error: 'Sucursal no encontrada' });
        }

        // Validar ubicación si se proporciona
        if (location && (typeof location.latitude !== 'number' || typeof location.longitude !== 'number')) {
            return res.status(400).json({ error: 'Ubicación inválida. Se requieren latitud y longitud numéricas.' });
        }

        // Actualizar la sucursal
        branch = await Branch.findByIdAndUpdate(
            id,
            { name, image, location },
            { new: true, runValidators: true }
        );

        res.json({ message: 'Sucursal actualizada correctamente', branch });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar una sucursal
const deleteBranch = async (req, res) => {
    try {
        const branch = await Branch.findByIdAndDelete(req.params.id);
        if (!branch) return res.status(404).json({ error: 'Sucursal no encontrada' });

        res.json({ message: 'Sucursal eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear múltiples sucursales
const createMultipleBranches = async (req, res) => {
    try {
        const branches = req.body.data; // Recibe un array de sucursales
        const newBranches = await Branch.insertMany(branches);
        res.status(201).json(newBranches);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { getBranches, getBranchById, createBranch, updateBranch, deleteBranch, createMultipleBranches };
