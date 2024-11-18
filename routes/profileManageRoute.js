const express = require('express');
const { createProfile, getAllProfile, getById, updateProfile,  deleteProfile } = require('../controllers/profileManageController');
const router = express.Router();

router.post('/add', createProfile);
router.get('/getAll', getAllProfile);
router.get('/:id', getById);
router.put('/:id', updateProfile);
router.delete('/:id', deleteProfile);

module.exports = router;