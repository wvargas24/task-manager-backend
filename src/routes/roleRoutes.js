const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

router.get('/', roleController.getRoles);
router.post('/', roleController.createRole);
router.post('/bulk-create', roleController.createMultipleRoles);
router.delete('/:id', roleController.deleteRole);

module.exports = router;
