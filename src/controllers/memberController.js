const bcrypt = require('bcryptjs');
const Member = require('../models/Member');
const Role = require('../models/Role');
const Company = require('../models/Company');

// Obtener todos los usuarios con su rol
const getMembers = async (req, res) => {
    try {
        const members = await Member.find().populate('role', 'name');
        res.json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un usuario por ID
const getMemberById = async (req, res) => {
    try {
        const { id } = req.params;
        const member = await Member.findById(id).populate('role', 'name');
        if (!member) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(member);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo usuario
const createMember = async (req, res) => {
    try {
        const { name, email, image, role, company, username, password } = req.body;

        // Verificar si el correo o el usuario ya existen
        const existingMember = await Member.findOne({ $or: [{ email }, { username }] });
        if (existingMember) {
            return res.status(400).json({ error: 'El correo o el nombre de usuario ya están registrados' });
        }

        // Verificar si el rol existe
        const roleExists = await Role.findById(role);
        if (!roleExists) {
            return res.status(400).json({ error: 'Rol no válido' });
        }

        // Verificar si la compañía existe
        const companyExists = await Company.findById(req.body.company);
        if (!companyExists) {
            return res.status(400).json({ error: 'Compañía no válida' });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario
        const member = new Member({
            name,
            email,
            username,
            password: hashedPassword,
            role,
            company,
            image: image || `https://www.gravatar.com/avatar/${email}?d=identicon`,
        });

        await member.save();
        res.status(201).json({ message: 'Usuario creado exitosamente', member });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar un usuario
const updateMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, image, role, company, username, password } = req.body;

        // Verificar si el usuario existe
        let member = await Member.findById(id);
        if (!member) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar si el nuevo username o email ya están en uso por otro usuario
        if (email || username) {
            const existingUser = await Member.findOne({
                $or: [{ email }, { username }],
                _id: { $ne: id }, // Excluir al usuario actual de la búsqueda
            });

            if (existingUser) {
                return res.status(400).json({ error: 'El correo o el nombre de usuario ya están en uso' });
            }
        }

        // Verificar si el rol existe
        if (role) {
            const roleExists = await Role.findById(role);
            if (!roleExists) {
                return res.status(400).json({ error: 'Rol no válido' });
            }
        }

        // Verificar si la compañía existe
        if (company) {
            const companyExists = await Company.findById(company);
            if (!companyExists) {
                return res.status(400).json({ error: 'Compañía no válida' });
            }
        }

        // Si hay contraseña en la actualización, encriptarla
        let hashedPassword = member.password; // Mantener la contraseña actual si no se cambia
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Actualizar el usuario
        member = await Member.findByIdAndUpdate(
            id,
            { name, email, image, role, company, username, password: hashedPassword },
            { new: true, runValidators: true }
        );

        res.json({ message: 'Usuario actualizado correctamente', member });

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

module.exports = { getMembers, getMemberById, createMember, updateMember, deleteMember, createMultipleMembers };
