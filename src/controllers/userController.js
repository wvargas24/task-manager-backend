const User = require('../models/User');
const Role = require('../models/Role');

// Obtener todos los usuarios con su rol
const getUsers = async (req, res) => {
    try {
        const users = await User.find().populate('role', 'name');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo usuario
const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, role } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        // Verificar si el rol existe
        const roleExists = await Role.findById(role);
        if (!roleExists) {
            return res.status(400).json({ error: 'Rol no válido' });
        }

        // Crear el usuario
        const user = new User({
            firstName,
            lastName,
            email,
            role,
            avatar: `https://www.gravatar.com/avatar/${email}?d=identicon`,
        });

        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getUsers, createUser, deleteUser };
