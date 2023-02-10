const path=require('path');

const express=require('express');
const bodyParser=require('body-parser');
const helmet=require('helmet');
const fs=require('fs')
const morgan=require('morgan');
const cors=require('cors');
const app=express();
app.use(bodyParser.json());
app.use(express.json());
const router=require('./route/router');
const premium=require('./route/purchase');
const forgotPassword=require('./route/forgetpassword');
const premiumFeature=require('./route/premiumFeature');
const download=require('./route/download');
const sequelize=require('./util/database');
const logindata = require('./model/logindata');
const Additem = require('./model/Additem');
const order = require('./model/order');
const ForgotPassword=require('./model/ForgotPasswordRequests');
const accessFile=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});
app.use(express.static(path.join(__dirname,'public')));
app.use(cors());
app.use(helmet());
app.use(morgan('combined',{stream:accessFile}));
app.use(router);
app.use(premium);
app.use(premiumFeature);
app.use(forgotPassword);
app.use(download);

app.use((req,res)=>{
    //console.log('some',req.url)
    res.sendFile(path.join(__dirname,`view/${req.url}`));
})

logindata.hasMany(ForgotPassword);
ForgotPassword.belongsTo(logindata);

logindata.hasMany(Additem);
Additem.belongsTo(logindata);

logindata.hasMany(order);
order.belongsTo(logindata);
sequelize
.sync()
.then(result=>{
    app.listen(4000);
})
.catch(err=>{
    console.log(err);
})