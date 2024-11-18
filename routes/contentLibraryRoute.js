const express = require('express');
const {addLibrary,getLibraries} = require('../controllers/contentLibraryController')
const router = express.Router();


router.post('/addLibrary',addLibrary );
router.get('/getLibraries',getLibraries );

module.exports = router;