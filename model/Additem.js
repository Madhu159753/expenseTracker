const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const Additem=sequelize.define('additem',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        unique:true,
        primaryKey:true,
        allowNull:false
    },
    description:{
        type:Sequelize.STRING,
        allowNull:false
    },
    choose:{
        type:Sequelize.STRING,
        allowNull:false
    },
    amount:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    expense:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
});
module.exports=Additem;