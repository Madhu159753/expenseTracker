const logindata=require('../model/Additem');
const AWS=require('aws-sdk');
const dotenv=require('dotenv');
dotenv.config();
function uploadToS3(data,filename){
    const BUCKET_NAME='uploadexpense';
    const IAM_USER_KEY=process.env.AWS_kEY
    const IAM_USER_SECRET=process.env.AWS_SECRETE
  
    let s3bucket=new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET
        //Bucket:BUCKET_NAME
    })
    // console.log(BUCKET_NAME)
    // console.log(IAM_USER_KEY);
    // console.log(IAM_USER_SECRET)
    
        var params={
            Bucket:BUCKET_NAME,
            Key:filename,
            Body:data,
            ACL:'public-read'
        }
       
        return new Promise((resolve,reject)=>{
            s3bucket.upload(params,(err,s3response)=>{
                if(err){
                    console.log('something went wrong',err);
                   reject(err);
                }
                else{
                    console.log('success',s3response);
                    resolve(s3response.Location);
                }
            })
        })
}

exports.download=async(req,res)=>{
    try{
  const expenses=await logindata.findAll({where:{loginId:req.user.id}});
   //console.log(expenses);
  const stringifiedExpenses=JSON.stringify(expenses);
  // it should depend upon user id
  const userid=req.user.id;

  const filename=`Expense${userid}/${new Date()}.txt`;
  const fileURL= await uploadToS3(stringifiedExpenses,filename);
  // console.log(fileURL);
  res.status(201).json({fileURL,success:true})
    }
    catch(err){
       // console.log(err);
        res.status(500).json({fileUrl:'',success:false})
    }
}

// exports.downloadAllUrl = async(req,res,next) => {
//     try {
//         let urls = await req.user.getDownloadurls() ;
//         if(!urls){
//             res.status(404).json({ message:'no urls found with this user' , success: false});
//         }
//         res.status(200).json({ urls , success: true })
//     } catch (error) {
//         res.status(500).json({ err})
//     }
// }