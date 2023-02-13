const express=require('express');
const router=express.Router();
const forgotPasswordConroller=require('../controller/forgotpassword');


router.get('/updatepassword/:resetpasswordid',forgotPasswordConroller.updatepassword)
router.get('/resetpassword/:id',forgotPasswordConroller.resetpassword )
router.post('/forgotPassword',forgotPasswordConroller.forgotpassword)

module.exports=router;