const express = require('express');
const { createEstimate,getAllEstimates ,getEstimateById,updateEstimate, deleteEstimate} = require('../controllers/estimateController');

const router = express.Router();

router.post('/create', createEstimate);
router.get('/getAllEstimates', getAllEstimates);
router.get('/getById/:id', getEstimateById);
router.delete('/delete/:id', deleteEstimate);

module.exports = router;
