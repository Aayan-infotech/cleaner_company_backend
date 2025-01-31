const express = require('express');
const {
    addEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployeeDetails,
    deleteEmployee,
    updateEmployeeStatus,
    updatePassword
} = require('../controllers/employeeManagementController');
const router = express.Router();

router.post('/addEmployee', addEmployee);// Add new employee

router.get('/getAllEmployees', getAllEmployees);

router.get('/getEmployee/:id', getEmployeeById);

router.put('/updateEmployee/:id', updateEmployeeDetails);

router.delete('/deleteEmployee/:id', deleteEmployee);

router.put('/updateEmployeeStatus/:id', updateEmployeeStatus);

router.put('/updatePassword/:id', updatePassword)

module.exports = router;

