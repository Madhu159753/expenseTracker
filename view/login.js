async function loginData(event){
    event.preventDefault();
    const loginObj={
      email:event.target.email.value,
      password:event.target.password.value
    };
    //console.log(loginObj);
    try{
      const response=await axios.post("http://54.144.45.46:4000/user-logins",loginObj)
      alert(response.data.message);
      console.log(response.data);
      localStorage.setItem('token',response.data.token)
      if(response.status===200){
      window.location.href="addExpence.html"
    }
  }
    catch(err)
    {
      //console.log(err);
      document.body.innerHTML+=`<div style="color:red">${err.message}</div>`;
    }
 }
 function forgotpassword(){
  window.location.href="ForgotPassword.html"
 }