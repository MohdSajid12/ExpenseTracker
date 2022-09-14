let daily=document.querySelector('.dailydata');
let weeklydata=document.querySelector('.weeklydata');


document.addEventListener('DOMContentLoaded',(e)=>{
    let token=localStorage.getItem('token');
    axios
      .get("http://localhost:8400/daily/expenses", {
        headers: { authorization: token },
      })
      .then((result) => {
        let res='';

        for(let i=0;i<result.data.length;i++){
let date = result.data[i].createdAt.split("T")[0];
            res += ` <tr class="table-light">
              <td >${date}</td>
              <td>${result.data[i].category}</td>
              <td>${result.data[i].description}</td>
              <td>${result.data[i].amount}</td>
            </tr>
`;
        }
        daily.innerHTML=res;

      })
      .catch((err) => {
        console.log(err);
      });
});

document.addEventListener("DOMContentLoaded", (e) => {
  let token = localStorage.getItem("token");
  axios
    .get("http://localhost:8400/weekly/expenses", {
      headers: { authorization: token },
    })
    .then((result) => {
      let res = "";

      for (let i = 0; i < result.data.length; i++) {
        let date = result.data[i].createdAt.split("T")[0];
        res += ` <tr class="table-light">
              <td >${date}</td>
              <td>${result.data[i].category}</td>
              <td>${result.data[i].description}</td>
              <td>${result.data[i].amount}</td>
            </tr>
`;
      }
      weeklydata.innerHTML = res;

      console.log();
    })
    .catch((err) => {
      console.log(err);
    });
});


