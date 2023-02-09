
const logindata=require('../model/logindata');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config()


exports.authenticate=(req,res,next)=>{
    try{
     const token=req.header('Authorization');
     console.log(token);
     const user=jwt.verify(token,process.env.JAVASCRIPT_ACCESSKEY_TOKEN);
     //console.log('loginId------>',user.loginId);
       logindata.findByPk(user.loginId).then(user =>{
        console.log(JSON.stringify(user));
        req.user=user;
        next();
       }).catch(err =>{throw new Error(err)})
        
     
    }
    catch(err){
       // console.log(err);
        res.status(401).json({success:false})

    }
}