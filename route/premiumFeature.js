const express=require('express');
const router=express.Router();
const authgetuserkey=require('../middleware/auth');
const premiumFeature=require('../controller/premiumFeature');
router.get('/showLeaderboard',authgetuserkey.authenticate,premiumFeature.getUserLeaderBoard)
router.get('/AddItem',authgetuserkey.authenticate,premiumFeature.AddUserIncome)
router.get('/AddExpenditure',authgetuserkey.authenticate,premiumFeature.AddUserExpenditure)
module.exports=router;