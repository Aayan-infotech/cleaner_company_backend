const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

// Get all jobs
router.get('/', jobController.getJobs);

// Create a new job
router.post('/', jobController.createJob);

// Get a single job by ID
router.get('/:id', jobController.getJobById);

// Update a job by ID
router.put('/:id', jobController.updateJob);

// Delete a job by ID
router.delete('/:id', jobController.deleteJob);

// Get all jobs scheduled by the logged-in technician
router.get('/myjobs/:EmployeeId', jobController.getJobsByTechnician);

module.exports = router;
