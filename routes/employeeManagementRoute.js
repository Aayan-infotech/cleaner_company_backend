const express = require('express');
const employeeController = require('../controllers/employeeManagementController');
const router = express.Router();

router.post('/addEmployee', employeeController.addEmployee);
router.get('/getAllEmployees', employeeController.getAllEmployees);
router.get('/get-all-employees', employeeController.getAllEmployee);
router.get('/getEmployee/:id', employeeController.getEmployeeById);
router.put('/updateEmployee/:id', employeeController.updateEmployeeDetails);
router.delete('/deleteEmployee/:id', employeeController.deleteEmployee);
router.put('/updateEmployeeStatus/:id', employeeController.updateEmployeeStatus);
router.put('/updatePassword/:id', employeeController.updatePassword)

module.exports = router;

