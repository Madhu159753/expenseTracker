
async function ForgotPassword(event){
    event.preventDefault();
    const emailObj={
        email:event.target.email.value
    };
   // console.log(emailObj)
    try{
     const response=await axios.post("http://54.144.45.46:4000/password/forgotPassword",emailObj)
    if(response.status===201){
    document.body.innerHTML += '<div style="color:red;">Mail Successfuly sent <div>'
}
else{
    document.body.innerHTML += '<div style="color:red;">some thing went wrong<div>'
}
    }catch(err){
       // console.log(err)
        document.body.innerHTML+=`<div style="color:red">${err.message}</div>`;
    }
}

           async function updatepassword(id){
            try{
            const response =await axios.get(`http://54.144.45.46:4000/updatepassword/${id}`)
               console.log(response.data)
            }
            catch(err){
                document.body.innerHTML+=`<div style="color:red">${err.message}</div>`;
            }
           }
        