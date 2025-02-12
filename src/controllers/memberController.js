const Member = require('../models/Member');
const Role = require('../models/Role');

// Obtener todos los usuarios con su rol
const getMembers = async (req, res) => {
    try {
        const members = await Member.find().populate('role', 'name');
        res.json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo usuario
const createMember = async (req, res) => {
    try {
        const { name, email, image, role } = req.body;

        // Verificar si el usuario ya existe
        const existingMember = await Member.findOne({ email });
        if (existingMember) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        // Verificar si el rol existe
        const roleExists = await Role.findById(role);
        if (!roleExists) {
            return res.status(400).json({ error: 'Rol no válido' });
        }

        // Crear el usuario
        const member = new Member({
            name,
            email,
            role,
            image: `https://www.gravatar.com/avatar/${email}?d=identicon`,
        });

        await member.save();
        res.status(201).json(member);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar un usuario
const updateMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, image, role } = req.body;

        // Verificar si el rol existe
        if (role) {
            const roleExists = await Role.findById(role);
            if (!roleExists) {
                return res.status(400).json({ error: 'Rol no válido' });
            }
        }

        const updatedMember = await Member.findByIdAndUpdate(
            id,
            { name, email, image, role },
            { new: true, runValidators: true }
        );

        if (!updatedMember) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(updatedMember);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un usuario
const deleteMember = async (req, res) => {
    try {
        const member = await Member.findByIdAndDelete(req.params.id);
        if (!member) return res.status(404).json({ error: 'Usuario no encontrado' });

        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crea una lista de usuarios
const createMultipleMembers = async (req, res) => {
    try {
        const members = req.body.data; // Recibe el array de miembros
        const newMembers = await Member.insertMany(members);
        res.status(201).json(newMembers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { getMembers, createMember, updateMember, deleteMember, createMultipleMembers };
