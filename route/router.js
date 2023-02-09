const express=require('express');
const router=express.Router();
const postData=require('../controller/postdata');
const gettingData=require('../controller/gettingData');
const authgetuserkey=require('../middleware/auth');

router.post('/user-signup',postData.postDataForSignUp);
router.post('/user-logins',postData.postLoginData);
router.post('/get-expense',authgetuserkey.authenticate,postData.addDataInExpense);
router.get('/get-data',authgetuserkey.authenticate,gettingData.gettingDataFromExpense);

router.delete('/delete-user/:id',authgetuserkey.authenticate,gettingData.deletedata);
module.exports=router;