const express = require("express");
const User = require('../models/userModel');
const { getAllUsers, getUser,deleteUser,updateUser,register } = require('../controllers/userController')
const { verifyAdmin, verifyUser } = require('../middleware/verifyToken')
// const company_route = express();
const router = express.Router();
const upload = require('../middleware/upload');

router.post('/register', upload.array('images', 3),register ); // Maximum of 10 files
router.get('/', verifyAdmin, getAllUsers);
router.get('/:id', verifyUser, getUser);
router.put('/:id', upload.array('images', 3), verifyAdmin, updateUser);
router.delete('/:id', verifyAdmin, deleteUser);
//router.post('/register', register);
module.exports = router;