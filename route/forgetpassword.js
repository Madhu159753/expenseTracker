const express=require('express');
const router=express.Router();
const forgotPasswordConroller=require('../controller/forgotpassword');
router.post('/forgotPassword',forgotPasswordConroller.forgotpassword)
router.get('/resetpassword/:id',forgotPasswordConroller.resetpassword )
router.get('/updatepassword/:resetpasswordid',forgotPasswordConroller.updatepassword)


module.exports=router;