let dropoptions = document.querySelector(".dropoptions");
let droper=document.querySelector('#droper');
let addexpensebtn = document.querySelector("#addexpensebtn");
let amount1=document.querySelector('#amount');
let category1 = document.querySelector("#category");
let description1=document.querySelector('#description');
let userdeatail=document.querySelector('.userdetail');
let expensedetails = document.querySelector(".expensedetails");
let alertpopup = document.querySelector("#alertpopup");
let ifempty=document.querySelector('.ifempty');
let logout=document.querySelector('#logout');
let dropshow=document.querySelector('#dropshow');
let subscriptionbtn=document.querySelector('#buysub');
addexpensebtn.addEventListener('click',(e)=>{
    let token = localStorage.getItem("token");

    e.preventDefault();
    let amount=amount1.value;
    let category=category1.value;
    let description=description1.value;


if(amount==""||category==""||description==""){
alertempty(e);
}
else{
    let obj={
        amount:amount,
        category:category,
        description:description
    }

    axios.post("http://localhost:8400/addexpense",{obj},{ headers: {"authorization" : token} })
    .then(result=>{
        console.log(result.data.result);
        getallexpenses();
        AlertItem(e);
        amount1.value="";
        category1.value="";
        description1.value="";
    })
    .catch(err=>{
        console.log(err);
    })

}

});

document.addEventListener('DOMContentLoaded',()=>{
        let token = localStorage.getItem("token");


axios.get("http://localhost:8400/getuserdata",{ headers: {"authorization" : token} })
.then(result=>{

if(result.data.suc=='yes'){

    userdeatail.innerHTML = result.data.result[0].name.split(" ")[0];

}

})
.then(err=>{
    console.log(err);
});

});
getallexpenses();


function getallexpenses(){
        let token = localStorage.getItem("token");

    axios
      .get("http://localhost:8400/getexpenses", {
        headers: { authorization: token },
      })
      .then((result) => {
        let allexp = "";
        console.log(result);

        for (let i = 0; i < result.data.result.length; i++) {
          let res = result.data.result[i];

          allexp += `
        <div class="singleexpense">
        <span class="gprice">${res.amount}</span>
        <span class="gcategory">${res.category}</span>
        <span class="gdescription">${res.description}</span>
        <button id=${res.id} style="background-color:red; float:right; color:white; border:none; padding:6px; margin-top:-8px;"><i class="fa-solid fa-trash"></i></button>
        </div>
        `;
        }
        expensedetails.innerHTML = allexp;
      })
      .catch((err) => {
        console.log(err);
      });
};


function AlertItem(e) {
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.innerHTML = `<h5> your expense stored </h5>`;
  alertpopup.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 2800);
}

function alertempty(e) {
  const notification = document.createElement("div");
  notification.classList.add("alertempty");
  notification.innerHTML = `<h6> please enter all the feilds </h6>`;
  alertpopup.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 4800);
}

logout.addEventListener('click',()=>{

  let result=  confirm("do you want to logout ");
  if(result){
    localStorage.clear();
    location.replace('login.html')
  }

});

let body=document.querySelector('body');
dropshow.addEventListener('click',(e)=>{ 
dropoptions.style.display='block';
});
dropshow.addEventListener('dblclick',()=>{
dropoptions.style.display = "none";

});


subscriptionbtn.addEventListener('click', buySubscription);

async function buySubscription(e){
        let token = localStorage.getItem("token");

    e.preventDefault();
        const response = await axios.get("http://localhost:8400/subscription", {
          headers: { authorization: token },
        });
        console.log(response);
        var options = {
          key: response.data.key_id, // Enter the Key ID generated from the Dashboard
          name: "Sajid",
          order_id: response.data.order.id, // For one time payment
          prefill: {
            name: "Sajid",
            email: "sajid@example.com",
            contact: "7374094182",
          },
          theme: {
            color: "#528FF0",
          },
          // This handler function will handle the success payment
          handler: function (response) {
            console.log(response);
            axios
              .post(
                "http://localhost:8400/updatetransaction",
                {
                  order_id: options.order_id,
                  payment_id: response.razorpay_payment_id,
                },
                { headers: { authorization: token } }
              )
              .then(() => {
                alert("Now You are a Premium User ");
              })
              .catch(() => {
                alert("Something went wrong. Try Again!");
              });
          },
        };


      const rzp1 = new Razorpay(options);
      rzp1.open();
      e.preventDefault();

      rzp1.on('payment.failed', function (response){
        alert("payment failed");
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
    });

  }