const Branch = require('../models/Branch');
const Company = require('../models/Company'); // Importar el modelo de Company

// Obtener todas las sucursales
// Obtener todas las sucursales
const getBranches = async (req, res) => {
    try {
        const { companyId } = req.query;  // Recibimos el companyId como parámetro de consulta

        // Buscar las branches que pertenecen a esa companyId y poblar la compañía
        const branches = await Branch.find({ company: companyId }).populate('company');

        if (branches.length === 0) {
            return res.status(404).json({ error: 'No se encontraron sucursales' });
        }

        res.json(branches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Obtener una sucursal por ID
const getBranchById = async (req, res) => {
    try {
        const branch = await Branch.findById(req.params.id).populate('company'); // Cargar toda la info de la compañía
        if (!branch) {
            return res.status(404).json({ message: 'Sucursal no encontrada' });
        }
        res.status(200).json(branch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBranchesByCountry = async (req, res) => {
    try {
        const { country } = req.query;

        if (!country) {
            return res.status(400).json({ error: 'Se requiere un país para filtrar.' });
        }

        const branches = await Branch.find({ "location.country": country }).populate('company');
        res.json(branches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Crear una nueva sucursal
const createBranch = async (req, res) => {
    try {
        const { name, image, location, company } = req.body;

        // Validar que la ubicación tenga latitud y longitud
        if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number' || !location.country) {
            return res.status(400).json({ error: 'Ubicación inválida. Se requieren latitud, longitud y país.' });
        }

        // Validar que se proporcione una compañía
        if (!company) {
            return res.status(400).json({ error: 'El ID de la compañía es obligatorio.' });
        }

        // Verificar si la compañía existe
        const companyExists = await Company.findById(company);
        if (!companyExists) {
            return res.status(404).json({ error: 'La compañía especificada no existe.' });
        }

        const branch = new Branch({ name, image, location, company });
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
        const { name, image, location, company } = req.body;

        // Buscar la sucursal
        let branch = await Branch.findById(id);
        if (!branch) {
            return res.status(404).json({ error: 'Sucursal no encontrada' });
        }

        // Validar ubicación si se proporciona
        if (location && (!location.country || typeof location.latitude !== 'number' || typeof location.longitude !== 'number')) {
            return res.status(400).json({ error: 'Ubicación inválida. Se requieren latitud, longitud y país.' });
        }

        // Si se proporciona un nuevo ID de compañía, verificar que exista
        if (company) {
            const companyExists = await Company.findById(company);
            if (!companyExists) {
                return res.status(404).json({ error: 'La compañía especificada no existe.' });
            }
        }

        // Actualizar la sucursal
        branch = await Branch.findByIdAndUpdate(
            id,
            { name, image, location, company },
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

        // Validar que todas las sucursales tengan una compañía asignada
        if (!branches.every(branch => branch.company)) {
            return res.status(400).json({ error: 'Todas las sucursales deben tener un ID de compañía.' });
        }

        // Verificar que todas las compañías existen
        const companyIds = [...new Set(branches.map(branch => branch.company))]; // Obtener IDs únicos de compañías
        const existingCompanies = await Company.find({ _id: { $in: companyIds } });

        if (existingCompanies.length !== companyIds.length) {
            return res.status(400).json({ error: 'Una o más compañías especificadas no existen.' });
        }

        const newBranches = await Branch.insertMany(branches);
        res.status(201).json(newBranches);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { getBranches, getBranchById, getBranchesByCountry, createBranch, updateBranch, deleteBranch, createMultipleBranches };
