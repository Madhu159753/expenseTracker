const sequelize=require('../util/database');
const Sequelize=require('sequelize');
const Forgotpassword=sequelize.define('forgotpassword',{
   id:{
    type:Sequelize.UUID,
     allowNull:false,
     primaryKey:true,
     unique:true
   } ,
   isactive:Sequelize.BOOLEAN,
   expiresby:Sequelize.DATE
});
module.exports=Forgotpassword;