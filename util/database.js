const dotenv=require('dotenv')
const Sequelize=require('sequelize');
dotenv.config();
const sequelize=new Sequelize(process.env.MYSQL_SCHEMA,process.env.MYSQL_USER,process.env.MYSQL_PASSWORD,{
    dialect:process.env.MYSQL_DIALECT,
    host:process.env.MYSQL_HOS
});

module.exports=sequelize;