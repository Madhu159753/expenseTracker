
async function signup(event){
    event.preventDefault();
    const signupDetails={
      name:event.target.name.value,
      email:event.target.email.value,
      password:event.target.password.value
    };
    try{
      const response=await axios.post(`http://54.144.45.46:4000/user-signup`,signupDetails)
      if(response.status===201)
      {
       window.location.href="login.html"
      }else{
        throw new Error('Fail to login');
      }
    }
    catch(err){
      console.log(err)
      document.body.innerHTML+=`<div style="color:red">${err}</div>`;
     }
   } 