
async function AddItem(event){
    event.preventDefault();
    const addItem={
        description:event.target.description.value,
        choose:event.target.choose.value,
        amount:event.target.amount.value,
        expense:event.target.expense.value,
    };
    try{
      const token=localStorage.getItem('token');
      const response=await axios.post("http://localhost:4000/get-expense",addItem,{headers: {"Authorization": token}})
      showDetailsOnScreen(response.data.Details) 
      showLeaderboard(); 
      //AddUserIncome();
      
      document.body.innerHTML=document.body.innerHTML+'<h1>Done<h1>'
     }catch(err)
      {
       console.log(err)
      }
  }
 function showDetailsOnScreen(user)
    {
      const parentNode=document.getElementById('list')
      const childHTML=`<tr id=${user.id}>
        <td>${user.description}</td> <td> ${user.choose}</td>
       <td>${user.amount}</td>  <td> ${user.expense}</td>
       <td> <button onclick=deleteExpenses('${user.id}')>Delete Expenses</button></td><br>
        </tr>`
        parentNode.innerHTML=parentNode.innerHTML+childHTML;
      
    }
    function showPremiumUserMessage(){
      document.getElementById('rzp-button1').style.visibility="hidden"
      document.getElementById('message').innerHTML="you are a premium user now"
    }
    function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
    window.addEventListener("DOMContentLoaded",async()=>{
      try{
      const token=localStorage.getItem('token');
      const ispremium=parseJwt(token);
       //console.log(ispremium);
      const isadmin=ispremium.ispremiumuser;
      if(isadmin){
        showPremiumUserMessage();
        showLeaderboard();
        AddUserIncome();
        AddUserExpenditure();
        downloadLink();
         }
     // console.log('123',token);
     
     
     const objUrlparms=new URLSearchParams(window.location.search)
     const page=objUrlparms.get("page")||1;
       const result1=await axios.get(`http://localhost:4000/get-data/?page=${page}`, { headers: {"Authorization": token}})
      //  console.log(result1.data.info)
      
           for(var i=0;i<result1.data.products.length;i++){
            showDetailsOnScreen(result1.data.products[i])
           showPagination(result1.data);
           }
           
           }catch(err){
               console.log(err)
           }
       })  

    async function deleteExpenses(userId){
       try{
         const token=localStorage.getItem('token');
         const result2=await axios.delete(`http://localhost:4000/delete-user/${userId}`, {headers :{"Authorization":token}})
         location.reload();
         removeUserFromScreen(userId);
          
           }catch(err)
            {
             console.log(err);
            }
        }
       // removeUserFromScreen(userId)
     function removeUserFromScreen(userId)
     {
       const parentNode=document.getElementById('list');
       const childNodeToBeDeleted=document.getElementById(userId);
        if(childNodeToBeDeleted){
           parentNode.removeChild(childNodeToBeDeleted);
        }
     };

 document.getElementById('rzp-button1').onclick=async function(e){
 const token=localStorage.getItem('token');
 const response=await axios.get('http://localhost:4000/premiummembership',{headers: {"Authorization":token}})
    var options={
       "key":response.data.key_id, //enter the keyid generated from the dash board
       "order_id":response.data.order.id, //for one time payment
          //handler function will handle the success payment
        "handler":async function(response){
           const res= await axios.post('http://localhost:4000/updatetransactionstatus',{
            order_id:options.order_id,
            payment_id:response.razorpay_payment_id,
            },{headers: {"Authorization": token}})
            alert('you are a premium user now');  
          localStorage.setItem('token',res.data.token);
          showPremiumUserMessage();
          showLeaderboard();
            
          },
      };
     
    const rzp1= new Razorpay(options);
     rzp1.open();
     e.preventDefault();
      rzp1.on('payment.failed',async function(response){
        const res= await axios.post('http://localhost:4000/failTransaction',{
            order_id:options.order_id,
            },{headers: {"Authorization": token}})
        //console.log(response);
        alert('something went wrong');
      })
    }

     function showLeaderboard(){
      const inputElement=document.createElement('input');
       inputElement.type="button"
       inputElement.value='Show Leaderboard'
       inputElement.onclick= async()=>{
      
        const token=localStorage.getItem('token');
        var userLeaderboardArray=await axios.get('http://localhost:4000/showLeaderboard',{headers :{"Authorization":token}})
       //console.log(userLeaderboardArray);
        var LeaderboardEle=document.getElementById('leaderboard')
        LeaderboardEle.innerHTML+='<h1>Leader board</h1>'
        userLeaderboardArray.data.forEach((addItem)=>{
        LeaderboardEle.innerHTML +=`<li> Name-${addItem.name}
        total Income -${addItem.total_cost}</li>`
    })
 }
     document.getElementById("message").appendChild(inputElement);
}

function AddUserIncome(){
      const inputElement=document.createElement('input');
       inputElement.type="button"
       inputElement.value="total income"
       inputElement.onclick= async()=>{
      
        const token=localStorage.getItem('token');
        var userLeaderboardArray=await axios.get('http://localhost:4000/AddItem',{headers :{"Authorization":token}})
      // console.log(userLeaderboardArray);
        
        var LeaderboardEle=document.getElementById('add')
        userLeaderboardArray.data.forEach((addItem)=>{
          LeaderboardEle.innerHTML +=`<h3>
             total income-${addItem.total}</h3>`
          })
      }
     document.getElementById("add").appendChild(inputElement);
  }
    function AddUserExpenditure(){
      const inputElement=document.createElement('input');
       inputElement.type="button"
       inputElement.value="total expenditure"
       inputElement.onclick= async()=>{
      
        const token=localStorage.getItem('token');
        var userLeaderboardArray=await axios.get("http://localhost:4000/AddExpenditure",{headers :{"Authorization":token}})
       //console.log(userLeaderboardArray);
        
        var LeaderboardEle=document.getElementById('sub')
        userLeaderboardArray.data.forEach((addItem)=>{
        LeaderboardEle.innerHTML +=`<h3>
         total Expenditure-${addItem.total}</h3>`
       })
    }
     document.getElementById("sub").appendChild(inputElement);
  }
  
 
    function showPagination({
      currentPage,
      hasNextPage,
      nextPage,
      hasPreviousPage,
      previousPage,
      lastPage
    }){
      const pagination=document.getElementById('pagination')
      pagination.innerHTML='';
      if(hasPreviousPage){
        const btn2=document.createElement('button')
        btn2.innerHTML=previousPage
        btn2.addEventListener('click',()=>getProduct(previousPage))
        pagination.appendChild(btn2)
      }
      const btn1=document.createElement('button')
      btn1.innerHTML=`<h3>${currentPage}</h3>`
      btn1.addEventListener('click',()=>getProduct(currentPage))
      pagination.appendChild(btn1)
  
      if(hasNextPage){
        const btn3=document.createElement('button')
        btn3.innerHTML=nextPage
        btn3.addEventListener('click',()=>getProduct(nextPage))
        pagination.appendChild(btn3)
      }
    }
    async function getProduct(page){
      try{
       const token=localStorage.getItem('token')
       
        const result1=await axios.get(`http://localhost:4000/get-data/?page=${page}`, { headers: {"Authorization": token}})
          // console.log(result1.data)
             for(var i=0;i<result1.data.products.length;i++){
              showDetailsOnScreen(result1.data.products[i])
              showPagination(result1.data);
             }
            }
            catch(err){
           console.log(err);
            }
          }

        async function download(){
          try{
          const token=localStorage.getItem('token');
          const response=await axios.get('http://localhost:4000/download', { headers: {"Authorization" : token} })
          if(response.status === 201){
            console.log(response.data.downloadUrlData);
            showUrlOnScreen(response.data.downloadUrlData)
          //the bcakend is essentially sending a download link
          //  which if we open in browser, the file would download
          var a = document.createElement("a");
          a.href = response.data.fileURL;
          a.download = 'myexpense.csv';
          a.click();
       }
       }catch(err){
         console.log(err);
      }
      }  



const listurl = document.getElementById('listurl-div');
let listno = 0;
 async function downloadLink(){
  const token =localStorage.getItem('token');
  try{

        
    let response = await axios.get('http://localhost:4000/getAllUrl', {headers:{'Authorization': token}})

    if(response.status === 200){
        //some code
        //console.log(reponse);
        console.log(response);
        
        showUrls(response.data);
        //showUrlOnScreen();

    }
    console.log('into reportsssssssssss');
}
catch(error){
    console.log(error);
    
   }
 }

 function showUrls(data){
  listurl.innerHTML = ''

  data.urls.forEach(url => {

      let child = `<li class="list" >
      <a href= "${url.fileURL}" class="expense-info"> ${listno + 1}. ${url.filename.split('/')[1]}</a>
      </li>`

      listurl.innerHTML += child

      listno++
      
  });
}

function showUrlOnScreen(data){
  // console.log(data);
  // console.log(data.fileURL);
   //console.log(data.fileURL)
   let  child = `<li class="list" >
       <a href="${data.fileURL}" class="expense-info">${listno + 1} ${data.filename.split('/')[1]}</a>
   </li>`  

listurl.innerHTML += child


}













