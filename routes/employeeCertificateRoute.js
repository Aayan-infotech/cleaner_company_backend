const express = require('express');
const router = express.Router();
const employeeCertificateController = require('../controllers/employeeCertificateController');

router.post('/addCertificate/:employee_id', employeeCertificateController.addCertificate);

router.get('/getAllCertificates/:employee_id', employeeCertificateController.getAllCertificates);

router.get('/getByID/:employee_id/:id', employeeCertificateController.getCertificateById);

router.put('/updateById/:employee_id/:id', employeeCertificateController.updateCertificate);

router.delete('/deleteCertificate/:employee_id/:id', employeeCertificateController.deleteCertificate);

module.exports = router;
