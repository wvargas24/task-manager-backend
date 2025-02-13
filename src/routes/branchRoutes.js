const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');

router.get('/', branchController.getBranches);
router.get('/:id', branchController.getBranchById);
router.post('/', branchController.createBranch);
router.put('/:id', branchController.updateBranch);
router.delete('/:id', branchController.deleteBranch);
router.post('/bulk-create', branchController.createMultipleBranches);

module.exports = router;
