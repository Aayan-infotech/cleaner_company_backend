const express = require('express');
const {login,registerAdmin,sendEmail,resetPassword,sendEmail1,resetPassword1,verifyOTP1} = require('../controllers/authController')

//as User
const router = express.Router();
router.post('/login', login);
//as Admin
router.post('/register-admin', registerAdmin);

//send reset email

router.post('/send-email',sendEmail)

//Reset Password
router.post("/resetPassword", resetPassword);

//otp
router.post('/send-email1',sendEmail1)
router.post('/verify-otp1', verifyOTP1);
router.post('/resetPassword1', resetPassword1);

module.exports = router;