const express = require('express');
const router = express.Router();
const obligationController = require('../controllers/obligationController');

router.get('/', obligationController.getObligations);
router.post('/', obligationController.createObligation);
router.post('/bulk-create', obligationController.createMultipleObligations);
router.put('/:id', obligationController.updateObligation);
router.delete('/:id', obligationController.deleteObligation);

module.exports = router;
