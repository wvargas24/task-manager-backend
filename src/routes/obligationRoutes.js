const express = require('express');
const router = express.Router();
const obligationController = require('../controllers/obligationController');

// Rutas de obligaciones
router.get('/', obligationController.getObligations);
router.post('/', obligationController.createObligation);
router.post('/bulk-create', obligationController.createMultipleObligations);
router.put('/:id', obligationController.updateObligation);
router.put('/bulk-update', obligationController.updateMultipleObligations);
router.delete('/:id', obligationController.deleteObligation);

// Ruta para agregar un comentario a una obligación
router.post('/:id/comments', obligationController.addCommentToObligation); // Nueva ruta

module.exports = router;
