const express = require('express');
const { createEstimate,getAllEstimates,deleteEstimate } = require('../controllers/estimateController');

const router = express.Router();

router.post('/submit-estimate', createEstimate);
router.get('/getAll', getAllEstimates);
router.delete('/:id', deleteEstimate);

module.exports = router;
