const jwt=require('jsonwebtoken');
const Razorpay=require('razorpay');
//const postDataController=require('./postdata');
const Order=require('../model/order');
const dotenv=require('dotenv');
dotenv.config()

function generateAccessToken(id,ispremiumuser){
    return jwt.sign({loginId:id,ispremiumuser},process.env.JAVASCRIPT_ACCESSKEY_TOKEN);
} 

exports.purchasePremium= (req,res)=>{
try{
 var rzp= new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
 }) 
 
 const amount = 2000;
  rzp.orders.create({amount, currency: "INR"},(err,order)=>{
    if(err){
        throw new Error(JSON.stringify(err))
    }
    req.user.createOrder({orderid:order.id,status:'pending'}).then(()=>{
        return res.status(201).json({order,key_id:rzp.key_id});
    }).catch(err=>{
        throw new Error(err)
    })
  })
}
catch(err){
//console.log(err);
res.json({message:"some thing went wrong",erroe:err})
}
};
exports.updateTransactionStatus= async (req,res)=>{
    try{
        const id=req.user.id;
        const{payment_id,order_id}=req.body;
        const order=await Order.findOne({where:{orderid:order_id}})
        const promise1= order.update({paymentid:payment_id,status:'SUCCESSFUL'})
         const promise2= req.user.update({ ispremiumuser:true})

         Promise.all([promise1, promise2]).then(()=>{
            return res.status(202).json({success:true,message:'successful', token:generateAccessToken(id,true)});
         }).catch((err)=>{
            console.log(err)
            throw new Error(err)
         })        
     }
    catch(err){
        //console.log(err);
        res.status(403).json({message:"payment fail",error:err})
    }
}
exports.failTransaction=async(req,res)=>{
    try{
        const{order_id}=req.body;
        const order=await Order.findOne({where:{orderid:order_id}})
        const promise1= order.update({status:'FAIL'})
    }
    catch(err){
        res.json(err)
    }
}