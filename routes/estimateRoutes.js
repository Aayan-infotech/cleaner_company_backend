const express = require('express');
const estimateController = require('../controllers/estimateController');

const router = express.Router();

router.post('/create', estimateController.createEstimate);
router.get('/getAll', estimateController.getAllEstimates);
router.get('/getAllPagination', estimateController.getAllEstimatespagination);
router.get('/getById/:id', estimateController.getEstimateById);
router.delete('/delete/:id', estimateController.deleteEstimate);

module.exports = router;
