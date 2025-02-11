const Role = require('../models/Role');

// Obtener todos los roles
const getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo rol
const createRole = async (req, res) => {
    try {
        const { name, permissions } = req.body;

        // Verificar si el rol ya existe
        const existingRole = await Role.findOne({ name });
        if (existingRole) {
            return res.status(400).json({ error: 'El rol ya existe' });
        }

        // Crear el rol
        const role = new Role({ name, permissions });
        await role.save();
        res.status(201).json(role);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un rol
const deleteRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        if (!role) return res.status(404).json({ error: 'Rol no encontrado' });

        res.json({ message: 'Rol eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getRoles, createRole, deleteRole };
