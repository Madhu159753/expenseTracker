const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');
//const nodeMailer=require('nodemailer');
const dotenv=require('dotenv')
const logindata = require('../model/logindata');
const Forgotpassword = require('../model/ForgotPasswordRequests');
const e = require('express');
dotenv.config()
exports.forgotpassword = async (req, res) => {
    try {
       const email  =  req.body.email;
       //const id=req.params.id;
        
        const user = await logindata.findOne({where : { email:email}});
        
        if(user){
            const id = uuid.v4();
        
            user.createForgotpassword({ id, active: true })
                .catch(err => {
                    throw new Error(err)
                })
                sgMail.setApiKey(process.env.SENDGRID_API_KEY)
                const msg={
                to: email, // Change to your recipient
                from: 'madhu01111998@gmail.com', // Change to your verified sender
                subject: 'Sending with SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                 html:`<a href="http://54.144.45.46:4000/password/resetpassword/${id}">Reset password</a>`,
            };
        console.log( `href="http://54.144.45.46:4000/password/resetpassword/${id}"`)


            sgMail
            .send(msg)
             .then((response) => {
                return res.status(201).json({message: 'Link to reset password sent to your mail ', sucess: true})
             })
            .catch((error) => {
                throw new Error(error);
            })
            //send mail
        }else {
            throw new Error('User doesnt exist')
        }
    } catch(err){
        console.error(err)
        return res.json({ message: err, sucess: false });
   }
}

exports.resetpassword = (req, res) => {
    const id =  req.params.id;
    Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                          <script>
                             function formsubmitted(e){
                               e.preventDefault();
                                  console.log('called')
                                    }
                             </script>
                             <form action="/password/updatepassword/${id}" method="get">
                                <label for="newpassword">Enter New password</label>
                                 <input name="newpassword" type="password" required></input>
                                 <button>reset password</button>
                                 </form>
                                </html>`
                                )
            res.end()

        }
    })
}

exports. updatepassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
            logindata.findOne({where: { id : resetpasswordrequest.loginId}}).then(user => {
                // console.log('userDetails', user)
                if(user) {
                    //encrypt the password

                    const saltRounds = 10;
                             bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}