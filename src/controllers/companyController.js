const Company = require('../models/Company');

// Obtener todas las compañías
const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find();
        res.json(companies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear una nueva compañía
const createCompany = async (req, res) => {
    try {
        const { name, logo } = req.body;

        // Verificar si el nombre de la empresa ya existe
        const existingCompany = await Company.findOne({ name });
        if (existingCompany) {
            return res.status(400).json({ error: 'El nombre de la empresa ya está registrado' });
        }

        const company = new Company({
            name,
            logo: logo || '', // Si no se proporciona logo, queda vacío
        });

        await company.save();
        res.status(201).json({ message: 'Empresa creada exitosamente', company });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar una compañía
const updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, logo } = req.body;

        // Verificar si la compañía existe
        let company = await Company.findById(id);
        if (!company) {
            return res.status(404).json({ error: 'Empresa no encontrada' });
        }

        // Verificar si el nuevo nombre ya está en uso por otra empresa
        if (name) {
            const existingCompany = await Company.findOne({ name, _id: { $ne: id } });
            if (existingCompany) {
                return res.status(400).json({ error: 'El nombre de la empresa ya está en uso' });
            }
        }

        // Actualizar la empresa
        company = await Company.findByIdAndUpdate(
            id,
            { name, logo },
            { new: true, runValidators: true }
        );

        res.json({ message: 'Empresa actualizada correctamente', company });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar una compañía
const deleteCompany = async (req, res) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id);
        if (!company) return res.status(404).json({ error: 'Empresa no encontrada' });

        res.json({ message: 'Empresa eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear múltiples compañías
const createMultipleCompanies = async (req, res) => {
    try {
        const companies = req.body.data; // Recibe un array de compañías
        const newCompanies = await Company.insertMany(companies);
        res.status(201).json(newCompanies);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { getCompanies, createCompany, updateCompany, deleteCompany, createMultipleCompanies };
