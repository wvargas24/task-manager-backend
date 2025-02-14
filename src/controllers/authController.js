const Member = require('../models/Member');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Función para generar un token JWT
const generateToken = (member) => {
    return jwt.sign(
        { id: member._id, username: member.username, role: member.role, companyId: member.companyId._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Expira en 1 hora
    );
};

// Login de usuario
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Buscar usuario en la base de datos
        const member = await Member.findOne({ username });
        if (!member) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        // Verificar contraseña
        const isMatch = await bcrypt.compare(password, member.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar y enviar token
        const token = generateToken(member);
        res.json({
            token,
            companyId: member.companyId._id,
            user: {
                id: member._id,
                username: member.username,
                role: member.role,
                name: member.name,  // Agrega más campos según lo que necesites
                email: member.email,
                image: member.image
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Registro de usuario (opcional, solo si quieres permitir nuevos registros)
const register = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Verificar si el usuario ya existe
        const userExists = await Member.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario en la base de datos
        const member = new Member({ username, password: hashedPassword, role });
        await member.save();

        // Generar y enviar token
        const token = generateToken(member);
        res.status(201).json({ token });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = { login, register }