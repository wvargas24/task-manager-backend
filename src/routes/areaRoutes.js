const express = require('express');
const router = express.Router();
const areaController = require('../controllers/areaController');

// Rutas de áreas
router.get('/', areaController.getAreas);
router.post('/', areaController.createArea);
router.post('/bulk-create', areaController.createMultipleAreas);
router.put('/:id', areaController.updateArea);
router.delete('/:id', areaController.deleteArea);

module.exports = router;
