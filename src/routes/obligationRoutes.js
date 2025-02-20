const express = require('express');
const router = express.Router();
const obligationController = require('../controllers/obligationController');

// Rutas de obligaciones
router.get('/', obligationController.getObligations);
router.post('/', obligationController.createObligation);
router.post('/bulk-create', obligationController.createMultipleObligations);
router.put('/bulk-update', obligationController.updateMultipleObligations);
router.put('/:id', obligationController.updateObligation);
router.delete('/:id', obligationController.deleteObligation);
router.post('/:id/comments', obligationController.addCommentToObligation); // Nueva Ruta para agregar un comentario
router.post('/:id/reports', addReportToObligation); // Nueva ruta para agregar reportes

module.exports = router;
