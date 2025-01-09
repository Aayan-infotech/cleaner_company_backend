const express = require('express');
const {addVersion,getVersions} = require('../controllers/contentVersionController')
const router = express.Router();


router.post('/addVersion',addVersion );
router.get('/getVersions',getVersions );

module.exports = router;