const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

router.post('/create', serviceController.createService);
router.get('/getAll', serviceController.getAllServices);
router.get('/getById/:id', serviceController.getServiceById);
router.put('/update/:id', serviceController.updateService);
router.delete('/delete/:id', serviceController.deleteService);
router.post('/addMethods/:serviceId', serviceController.addMethodToService);
router.delete('/delete/:serviceId/:methodId', serviceController.removeMethodFromService);
router.get('/getMethodByService/:serviceId', serviceController.getMethodsByServiceId);

module.exports = router;

