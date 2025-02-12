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

const createMultipleRoles = async (req, res) => {
    try {
        const roles = req.body.roles; // Array de roles a crear

        if (!Array.isArray(roles) || roles.length === 0) {
            return res.status(400).json({ message: "Debe proporcionar un array de roles válido." });
        }

        const createdRoles = await Role.insertMany(roles, { ordered: false });

        res.status(201).json({
            message: "Roles creados exitosamente.",
            data: createdRoles
        });
    } catch (error) {
        console.error("Error al crear roles:", error);
        res.status(500).json({
            message: "Ocurrió un error al crear los roles.",
            error: error.message
        });
    }
};


module.exports = { getRoles, createRole, deleteRole, createMultipleRoles };
