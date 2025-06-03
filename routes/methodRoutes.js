const express = require('express');
const router = express.Router();
const methodController = require('../controllers/methodController');


// Method routes
router.post('/add', methodController.createMethod);
router.get('/getAll', methodController.getAllMethods);
router.get('/getById/:id', methodController.getMethodById);
router.put('/update/:id', methodController.updateMethod);
router.delete('/delete/:id', methodController.deleteMethod);

module.exports = router;
