sb = "http://localhost:3040/";
token = document.cookie.split(";").filter((data) => {
  return data.indexOf("accessToken") >= 0;
})[0];
if (token) {
  token = token.split("=");
}
if (token && token.length == 1) {
  token = undefined;
} else if (token && token.length == 2) {
  token = token[1];
}

var globalflag = 1;
$("#mdi_menu_btn").on("click", () => {
  globalflag = 1 ^ globalflag
  $("#sidebar").toggle();
  if(globalflag == 0){

    document.querySelector("#main_nav_bar1").style = "width:100%";
    document.querySelector("#main_nav_bar").style = "left:0em";
  }
  else{
    // document.querySelector("#main_nav_bar1").style = "width:px";
    document.querySelector("#main_nav_bar").style = "left:260px";
  }
  // $('#nav1').toggle();
  // $('#main_nav_bar').style.css("width",100)
});
$("#mdi-menu-1").on("click",()=>{
  $("#sidebar").toggle();
})

function paginationparent(i, id) {
  $(`#${id}`).addClass("active");
  $.ajax({
    url: sb + "allusersparent",
    type: "GET",
    headers: {
      token: token,
      pageno: i,
    },
    error: function (err) {
      console.log(err.status);
      if (err.status == 400) window.location.href = "index.html";
    },
    success: function (data) {
      console.log(data);
      str = "";
      for (i in data["data"]) {
        str += `<tr>
                <td>
                <div class="d-flex align-items-center">
                    <img src="assets/images/faces/face1.jpg" alt="image" />
                    <div class="table-user-name ml-3">
                    <p class="mb-0 font-weight-medium"> ${data.data[i].name} </p>
                    <small>${data.data[i].status}</small>
                    </div>
                </div>
                </td>
                <td>${data.data[i].email}</td>
                <td>`;
        if (data.data[i].disable) {
          str += `<div class="badge badge-inverse-danger" id="${data.data[i]._id}type"> ${data.data[i].type} </div>`;
          str += `</td>
                    <td id="${data.data[i]._id}"> <button type="button" class="btn btn-sm ml-3 btn-success" onclick="updateDisable('${data.data[i]._id}',1)"> Activate </button> </td>
                    </tr>`;
        } else {
          str += `<div class="badge badge-inverse-danger" id="${data.data[i]._id}type"> ${data.data[i].type} </div>`;
          str += `</td>
                    <td id="${data.data[i]._id}"> <button type="button" class="btn btn-sm ml-3 btn-danger" onclick="updateDisable('${data.data[i]._id}',0)"> Hold </button> </td>
                    </tr>`;
        }
      }
      $("#tbodyparent").html(str);
      for (let i = 0; i < data.count; i++) {
        tem = "page" + i;
        $(`#${tem}p`).removeClass("active");
      }
      $(`#${id}`).addClass("active");
    },
  });
}

function pagination(i, id) {
  $(`#${id}`).addClass("active");
  $.ajax({
    url: sb + "allusers",
    type: "GET",
    headers: {
      token: token,
      pageno: i,
    },
    error: function (err) {
      console.log(err.status);
      if (err.status == 400) window.location.href = "index.html";
    },
    success: function (data) {
      console.log(data);
      str = "";
      for (i in data["data"]) {
        str += `<tr>
                <td>
                <div class="d-flex align-items-center">
                    <img src="assets/images/faces/face1.jpg" alt="image" />
                    <div class="table-user-name ml-3">
                    <p class="mb-0 font-weight-medium"> ${data.data[i].name} </p>
                    <small>${data.data[i].status}</small>
                    </div>
                </div>
                </td>
                <td>${data.data[i].email}</td>
                <td>`;
        if (data.data[i].disable) {
          str += `<a href="${data.data[i].aadhar}"><div class="badge badge-inverse-danger" id="${data.data[i]._id}type"> ${data.data[i].type} </div></a>`;
          str += `</td>
                    <td id="${data.data[i]._id}"> <button type="button" class="btn btn-sm ml-3 btn-success" onclick="updateDisable('${data.data[i]._id}',1)"> Activate </button> </td>
                    </tr>`;
        } else {
          str += `<a href="${data.data[i].aadhar}"><div class="badge badge-inverse-danger" id="${data.data[i]._id}type"> ${data.data[i].type} </div></a>`;
          str += `</td>
                    <td id="${data.data[i]._id}"> <button type="button" class="btn btn-sm ml-3 btn-danger" onclick="updateDisable('${data.data[i]._id}',0)"> Hold </button> </td>
                    </tr>`;
        }
      }
      $("#tbody").html(str);
      for (let i = 0; i < data.count; i++) {
        tem = "page" + i;
        $(`#${tem}`).removeClass("active");
      }
      $(`#${id}`).addClass("active");
    },
  });
}

function updateDisable(id, status) {
  $.ajax({
    url: sb + "updateDisable",
    type: "PUT",
    headers: {
      token: token,
    },
    contentType: "application/json",
    data: JSON.stringify({
      _id: id,
    }),
    error: function (err) {
      console.log(err.status);
      if (err.status == 400) window.location.href = "index.html";
    },
    success: function (data) {
      console.log(status, `#${id}`);
      if (status == "1") {
        $(`#${id}`).html(
          ` <button type="button" class="btn btn-sm ml-3 btn-danger" onclick="updateDisable('${id}',0)" > Hold </button> `
        );

        $(`#${id}type`).removeClass("badge-inverse-danger");
        $(`#${id}type`).addClass("badge-inverse-success");
        console.log(status, $(`#${id}`).innerHTML);
      } else {
        $(`#${id}`).html(
          `<button type="button" class="btn btn-sm ml-3 btn-success" onclick="updateDisable('${id}',1)"> Activate </button>`
        );
        $(`#${id}type`).removeClass("badge-inverse-success");
        $(`#${id}type`).addClass("badge-inverse-danger");
        console.log(status, $(`#${id}`).innerHTML);
      }
    },
  });
}

function moderatorOff() {
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
}

function moderate(id) {
  $.ajax({
    url: sb + "content_moderate",
    type: "GET",
    headers: {
      token: token,
      id: id,
    },
    error: function (err) {
      console.log(err.status);
      console.log("admin error");
      if (err.status == 401) window.location.href = "/signup.html";
    },
    success: function (data) {
      console.log(data);
      var modal = document.getElementById("myModal");
      var btn = document.getElementById("myBtn");
      var span = document.getElementsByClassName("close")[0];
      //$(`#${id}`).after( `<t>${JSON.stringify(data)}</tr>`)
      modal.style.display = "block";
      str = `
      <span class="close" onclick="moderatorOff()">&times;</span>
      <div class="row">
      <div class="col-md-12 col-sm-6 item">
      <div class="card item-card card-block">
        <img src="${data[1].image}" alt="Photo of sunset">
        <h5 class="item-card-title mt-3 mb-3">${data[1].postedbyname} </h5>
        <p class="card-text">${data[1].posttext}.</p>
      </div>
      </div>
      </div>
      `;
      str += `<div class="row" style="justify-content:space-around; margin-top:1em">`;
      if (data[0].result) {
        str += `
              <div class="badge badge-inverse-danger"> 
              No Child Safe
              </div>
              <br>
              <div>probability of rejection 
              <div class="badge badge-inverse-danger"> ${data[0].prob}%
              </div>
              </div>
              `;
      } else {
        str += ` 
              <div class="badge badge-inverse-success"> 
              Child Safe
              </div>
              <br>
              <div>probability of rejection 
              <div class="badge badge-inverse-danger"> ${data[0].prob}%
              </div>
              </div>
              `;
      }
      str += `</div>`;
      console.log(str);
      $("#modal_post").html(str);
      console.log("done");
    },
  });
}

function generateReport() {
  var startDate = $("#startDate").val();
  var endDate = $("#endDate").val();
  console.log(startDate, endDate);
  $.ajax({
    url: sb + "generateReport",
    type: "GET",
    headers: {
      token: token,
      startDate: startDate,
      endDate: endDate,
    },
    error: function (err) {
      console.log(err.status);
      if (err.status == 400) window.location.href = "index.html";
    },
    success: function (data) {
      // childUsers,parentUsers,postsc,activeUser
      // "parentUsers":requiredParentUsers,
      // "childUsers":requiredChildUsers,
      // "posts":requiredPosts,
      // "activeUsers":activeUsers
      console.log(data);
      $("#childUsers").text(data.childUsers);
      $("#parentUsers").text(data.parentUsers);
      $("#postsc").text(data.postsc);
      $("#activeUser").text(data.activeUsers);
      $("#reportHeading").text(`Report from ${startDate} to ${endDate}`);
      //datereportuserslist
      str = "";
      for (i in data["data"]) {
        str += `<tr>
                    <td>
                    <div class="d-flex align-items-center">
                        <img src="assets/images/faces/face1.jpg" alt="image" />
                        <div class="table-user-name ml-3">
                        <p class="mb-0 font-weight-medium"> ${data.data[i].name} </p>
                        <small>${data.data[i].status}</small>
                        </div>
                    </div>
                    </td>
                    <td>${data.data[i].email}</td>
                    <td>`;
        if (data.data[i].disable) {
          str += `<div class="badge badge-inverse-danger" id="${data.data[i]._id}type"> ${data.data[i].type} </div>`;
          str += `</td>
                        <td id="${data.data[i]._id}"> <button type="button" class="btn btn-sm ml-3 btn-success" onclick="updateDisable('${data.data[i]._id}',1)"> Activate </button> </td>
                        </tr>`;
        } else {
          str += `<div class="badge badge-inverse-success" id="${data.data[i]._id}type"> ${data.data[i].type} </div>`;
          str += `</td>
                        <td id="${data.data[i]._id}"> <button type="button" class="btn btn-sm ml-3 btn-danger" onclick="updateDisable('${data.data[i]._id}',0)" > Hold </button> </td>
                        </tr>`;
        }
      }
      $("#datereportuserslist").html(str);
      //datereportpostslist
      str = "";
      for (i in data["posts"]) {
        str += `<tr>
                    <td>
                    <div class="d-flex align-items-center">
                        <img src="assets/images/faces/face1.jpg" alt="image" />
                        <div class="table-user-name ml-3">
                        <p class="mb-0 font-weight-medium"> ${data.posts[i].posttext} </p>
                        </div>
                    </div>
                    </td>
                    <td>${data.posts[i].category}</td>
                    <td>`;

        str += `<div class="badge badge-inverse-success" id="${data.posts[i]._id}type"> ${data.posts[i].localTime} </div>`;
        str += `</td></tr>`;
      }
      $("#datereportpostslist").html(str);
    },
  });
}

if (window.location.href.indexOf("adminDashBoard") >= 0) {
  $("#postsButton").on("click", () => {
    console.log("inside postsButton");
    $(".main-panel").css({ display: "none" });
    $(".main-panel1").css({ display: "none" });
    $(".main-panel2").css({ display: "none" });
    $.ajax({
      url: sb + "poststable",
      type: "GET",
      headers: {
        token: token,
      },
      error: function (err) {
        console.log(err.status);
        if (err.status == 400) window.location.href = "index.html";
      },
      success: function (data) {
        str = ``;
        for (i of data) {
          str += `<div class="col-md-4 col-sm-6 item">
        <div class="card item-card card-block">
          <img src="${i.image}" alt="Photo of sunset">
          <h5 class="item-card-title mt-3 mb-3">${i.postedbyname} </h5>
          <p class="card-text">${i.posttext}.</p>
        </div>
      </div>`;
        }
        $("#postpagedata").html(str);
      },
    });
    $(".posts").css({ display: "block" });
  });

  $("#usersButton").on("click", () => {
    $(".posts").css({ display: "none" });
    $(".main-panel").css({ display: "none" });
    $(".main-panel1").css({ display: "block" });
    $(".main-panel2").css({ display: "none" });

    //main-pannel-1 poststable
    $.ajax({
      url: sb + "poststable",
      type: "GET",
      headers: {
        token: token,
      },
      error: function (err) {
        console.log(err.status);
        if (err.status == 400) window.location.href = "index.html";
      },
      success: function (data) {
        console.log(data);
        str = "";
        for (i in data) {
          str += `<tr id='${data[i]._id}'>
          <td>${data[i].postedby}</td>
          <td>${data[i]._id}</td>
          <td>${new Date(data[i].time).getDate()}-${new Date(
            data[i].time
          ).getMonth()}-${new Date(data[i].time).getFullYear()}</td>
          <td>`;
          if (data[i].status == "pending")
            str += `<label class="badge badge-danger">Pending</label>`;
          else if (data[i].status == "rejected")
            str += `<label class="badge badge-warning">In progress</label>`;
          else str += `<label class="badge badge-success">Completed</label>`;
          str += `</td>
          <td><button type="button"
          class="btn btn-sm  btn-icon-text btn-dark border ml-3" onclick="moderate('${data[i]._id}')">
           Content Moderator </button></td>
        </tr>`;
        }
        $("#poststabledata").html(str);
      },
    });
  });

  //posts atlas search
  $("#post_search_button").on("click", () => {
    var target_search = $("#post_search_input").val();
    console.log(target_search);
    $.ajax({
      url: sb + "poststable",
      type: "GET",
      headers: {
        token: token,
        target_search: target_search,
      },
      error: function (err) {
        console.log(err.status);
        if (err.status == 400) window.location.href = "index.html";
      },
      success: function (data) {
        console.log(data);
        str = ``;
        for (i of data) {
          str += `<div class="col-md-4 col-sm-6 item">
        <div class="card item-card card-block">
          <img src="${i.image}" alt="Photo of sunset">
          <h5 class="item-card-title mt-3 mb-3">${i.postedbyname} </h5>
          <p class="card-text">${i.posttext}.</p>
        </div>
      </div>`;
        }
        $("#postpagedata").html(str);
      },
    });
  });

  //usersButton viewapplicants
  viewFlag = false;
  function viewallusers() {
    $.ajax({
      url: sb + "viewallusers",
      type: "GET",
      headers: {
        token: token,
        viewflag: viewFlag,
      },
      error: function (err) {
        console.log(err.status);
        if (err.status == 400) window.location.href = "index.html";
      },
      success: function (data) {
        console.log(data);
        viewFlag = false;
        str = "";
        for (i in data["data"]) {
          str += `<tr>
                    <td>
                    <div class="d-flex align-items-center">
                        <img src="assets/images/faces/face1.jpg" alt="image" />
                        <div class="table-user-name ml-3">
                        <p class="mb-0 font-weight-medium"> ${data.data[i].name} </p>
                        <small>${data.data[i].status}</small>
                        </div>
                    </div>
                    </td>
                    <td>${data.data[i].email}</td>
                    <td>`;
          if (data.data[i].disable) {
            str += `<div class="badge badge-inverse-danger" id="${data.data[i]._id}type"> ${data.data[i].type} </div>`;
            str += `</td>
                        <td id="${data.data[i]._id}"> <button type="button" class="btn btn-sm ml-3 btn-success" onclick="updateDisable('${data.data[i]._id}',1)"> Activate </button> </td>
                        </tr>`;
          } else {
            str += `<div class="badge badge-inverse-success" id="${data.data[i]._id}type"> ${data.data[i].type} </div>`;
            str += `</td>
                        <td id="${data.data[i]._id}"> <button type="button" class="btn btn-sm ml-3 btn-danger" onclick="updateDisable('${data.data[i]._id}',0)" > Hold </button> </td>
                        </tr>`;
          }
        }
        $("#tbody1").html(str);
      },
    });
  }

  $("#viewallusers").on("click", () => {
    viewFlag = true;
    viewallusers();
  });

  $("#reportButton").on("click", () => {
    $(".posts").css({ display: "none" });
    $(".main-panel").css({ display: "none" });
    $(".main-panel2").css({ display: "block" });
    $(".main-panel1").css({ display: "none" });

    $.ajax({
      url: sb + "pie_Chart_gender",
      type: "GET",
      headers: {
        token: token,
      },
      error: function (err) {
        console.log(err.status);
        console.log("admin error");
        if (err.status == 401) window.location.href = "/signup.html";
      },
      success: function (data) {
        console.log(data);
        labels = [];
        src = [];
        data.forEach((element) => {
          labels.push(element["gender"]);
          src.push(element["count"]);
        });
        var ctx = document.getElementById("pieChart1");
        var myChart = new Chart(ctx, {
          type: "pie",
          data: {
            labels: labels,
            datasets: [
              {
                label: "30",
                data: src,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.5)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                ],
                borderColor: [
                  "rgba(255,99,132,1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            //cutoutPercentage: 40,
            responsive: false,
          },
        });
      },
    });

    $.ajax({
      url: sb + "barchat_ages",
      type: "GET",
      headers: {
        token: token,
      },
      error: function (err) {
        console.log(err.status);
        console.log("admin error");
        if (err.status == 401) window.location.href = "/signup.html";
      },
      success: function (data) {
        console.log(data);
        labels = [];
        src = [];
        data.forEach((element) => {
          labels.push(element["age"]);
          src.push(element["count"]);
        });
        var ctx = document.getElementById("barChart1");
        var myChart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                label: "50",
                data: src,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(255, 159, 64, 0.2)",
                ],

                borderColor: [
                  "rgba(255,99,132,1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          },
        });
      },
    });
  });

  //starting ajax call
  $(document).ready(function () {
    console.log("fgh");
    $(".posts").css({ display: "none" });
    $(".main-panel1").css({ display: "none" });
    $(".main-panel2").css({ display: "none" });
    $.ajax({
      url: sb + "getAdminDashBoard",
      type: "GET",
      headers: {
        token: token,
      },
      error: function (err) {
        console.log(err.status);
        console.log("admin error");
        if (err.status == 401) window.location.href = "/signup.html";
      },
      success: function (data) {
        console.log(data);
      },
    });
    $.ajax({
      url: sb + "allusers",
      type: "GET",
      headers: {
        token: token,
        pageno: 0,
      },
      error: function (err) {
        console.log(err.status);
        if (err.status == 400) window.location.href = "index.html";
      },
      success: function (data) {
        console.log(data);
        str = "";
        for (i in data["data"]) {
          str += `<tr>
                    <td>
                    <div class="d-flex align-items-center">
                        <img src="assets/images/faces/face1.jpg" alt="image" />
                        <div class="table-user-name ml-3">
                        <p class="mb-0 font-weight-medium"> ${data.data[i].name} </p>
                        <small>${data.data[i].status}</small>
                        </div>
                    </div>
                    </td>
                    <td>${data.data[i].email}</td>
                    <td>`;
          if (data.data[i].disable) {
            str += `<a href="${data.data[i].aadhar}"><div class="badge badge-inverse-danger"  id="${data.data[i]._id}type"> ${data.data[i].type} </div></a>`;
            str += `</td>
                        <td id="${data.data[i]._id}"> <button type="button" class="btn btn-sm ml-3 btn-success" onclick="updateDisable('${data.data[i]._id}',1)"> Activate </button> </td>
                        </tr>`;
          } else {
            str += `<a href="${data.data[i].aadhar}"><div class="badge badge-inverse-danger" id="${data.data[i]._id}type"> ${data.data[i].type} </div></a>`;
            str += `</td>
                        <td id="${data.data[i]._id}"> <button type="button" class="btn btn-sm ml-3 btn-danger" onclick="updateDisable('${data.data[i]._id}',0)" > Hold </button> </td>
                        </tr>`;
          }
        }
        $("#tbody").html(str);
        $("#tbody1").html(str);
        str = `<li class="page-item">
                    <a href="#" class="page-link" aria-label="Previous">
                        <span aria-hidden="true">«</span>
                    </a>
                    </li>`;
        for (let i = 0; i < data["count"]; i++) {
          tem = `page` + i;
          str += `<li class="page-item " id="${tem}"><a class="page-link" onclick="pagination(${i},'${tem}')">${i}</a></li>`;
        }
        str += `<li class="page-item">
                        <a href="#" class="page-link" aria-label="Next">
                            <span aria-hidden="true">»</span>
                        </a>
                    </li>`;
        $("#paginationId").html(str);
        // $('#paginationId1').html(str);
      },
    });

    //ajax call parent
    $.ajax({
      url: sb + "allusersparent",
      type: "GET",
      headers: {
        token: token,
        pageno: 0,
      },
      error: function (err) {
        console.log(err.status);
        if (err.status == 400) window.location.href = "index.html";
      },
      success: function (data) {
        console.log(data);
        str = "";
        for (i in data["data"]) {
          str += `<tr>
                    <td>
                    <div class="d-flex align-items-center">
                        <img src="assets/images/faces/face1.jpg" alt="image" />
                        <div class="table-user-name ml-3">
                        <p class="mb-0 font-weight-medium"> ${data.data[i].name} </p>
                        <small>${data.data[i].status}</small>
                        </div>
                    </div>
                    </td>
                    <td>${data.data[i].email}</td>
                    <td>`;
          if (data.data[i].disable) {
            str += `<div class="badge badge-inverse-danger"  id="${data.data[i]._id}type"> ${data.data[i].type} </div>`;
            str += `</td>
                        <td id="${data.data[i]._id}"> <button type="button" class="btn btn-sm ml-3 btn-success" onclick="updateDisable('${data.data[i]._id}',1)"> Activate </button> </td>
                        </tr>`;
          } else {
            str += `<div class="badge badge-inverse-danger" id="${data.data[i]._id}type"> ${data.data[i].type} </div>`;
            str += `</td>
                        <td id="${data.data[i]._id}"> <button type="button" class="btn btn-sm ml-3 btn-danger" onclick="updateDisable('${data.data[i]._id}',0)" > Hold </button> </td>
                        </tr>`;
          }
        }
        $("#tbodyparent").html(str);
        str = `<li class="page-item">
                    <a href="#" class="page-link" aria-label="Previous">
                        <span aria-hidden="true">«</span>
                    </a>
                    </li>`;
        for (let i = 0; i < data["count"]; i++) {
          tem = `page` + i;
          str += `<li class="page-item " id="${tem}p"><a class="page-link" onclick="paginationparent(${i},'${tem}p')">${i}</a></li>`;
        }
        str += `<li class="page-item">
                        <a href="#" class="page-link" aria-label="Next">
                            <span aria-hidden="true">»</span>
                        </a>
                    </li>`;
        $("#paginationIdparent").html(str);
        // $('#paginationId1').html(str);
      },
    });
    //ajax call to populate the recent users
    $.ajax({
      url: sb + "recentUsers",
      type: "GET",
      headers: {
        token: token,
      },
      error: function (err) {
        console.log(err.status);
        if (err.status == 400) window.location.href = "index.html";
      },
      success: function (data) {
        imgTags = $(".Recent_users img");
        h6Tags = Array.from($(".Recent_users h6"));
        pTags = $(".Recent_users p");
        for (i in data) {
          h6Tags[i].innerText = data[i].name;
          pTags[i].innerText = data[i].localTime;
        }
        //$('.Recent_users').html(str)
      },
    });

    //active users,total users,total posts
    $.ajax({
      url: sb + "usersInfo",
      type: "GET",
      headers: {
        token: token,
      },
      error: function (err) {
        console.log(err.status);
        if (err.status == 400) window.location.href = "index.html";
      },
      success: function (data) {
        console.log(data);
        $("#viewCount").text(data.active);
        $("#userCount").text(data.total);
        $("#userAnalytics").text(
          Math.round((100 * data.totalIncUser) / 100) + "% Since last 24hrs"
        );
        $("#postCount").text(data.posts);
        $("#postAnalytics").text(
          Math.round((100 * data.totalIncPost) / 100) + "% Since last 24hrs"
        );
        $("#page0").addClass("active");
        $("#childUsers").text(data.childUsers);
        $("#parentUsers").text(data.parentUsers);
        $("#postsc").text(data.postsc);
        $("#activeUser").text(data.activeUsers);
      },
    });

    //top 5 liked posts
    $.ajax({
      url: sb + "top5posts",
      type: "GET",
      headers: {
        token: token,
      },
      error: function (err) {
        console.log(err.status);
        if (err.status == 400) window.location.href = "index.html";
      },
      success: function (data) {
        var postName = Array.from($(".postName"));

        console.log(postName, $(".postName")[2]);
        for (let i = 0; i < Math.min(5,data.length); i++) {
          document.querySelectorAll(".postName")[i].innerText =
            data[i].posttext;
        }
        var postCreator = $(".postCreator");
        for (let i = 0; i < Math.min(5,data.length); i++) {
          document.querySelectorAll(".postCreator")[i].innerText =
            data[i].posttext;
        }
        var postLikes = $(".postLikes");
        for (let i = 0; i < Math.min(5,data.length); i++) {
          document.querySelectorAll(".postLikes")[i].innerText =
            "+" + data[i].likeCount;
        }
      },
    });

    //recent pending posts
    $.ajax({
      url: sb + "pendingposts",
      type: "GET",
      headers: {
        token: token,
      },
      error: function (err) {
        console.log(err.status);
        if (err.status == 400) window.location.href = "index.html";
      },
      success: function (data) {
        console.log(data);
        for (let i = 0; i < Math.min(4,data.length); i++) {
          document.querySelectorAll(".pendingPost")[i].innerText =
            data[i].localTime;
        }
        for (let i = 0; i < Math.min(4,data.length); i++) {
          document.querySelectorAll(".pendingName")[i].innerText =
            data[i].postedbyname;
        }
      },
    });

    //admin activity  admin_activity
    $.ajax({
      url: sb + "admin_activity",
      type: "GET",
      headers: {
        token: token,
      },
      error: function (err) {
        console.log(err.status);
        console.log("admin error");
        if (err.status == 401) window.location.href = "/signup.html";
      },
      success: function (data) {
        console.log(data);
        str = "";
        for (i of data[0]) {
          str += `<li>
          <h6 class="mb-0">logined at  ${i.substring(0, 15)}</h6>
          <p class="text-muted" > ${i.substring(15)}</p>
        </li>`;
        }
        $("#admin_activity").html(str);
        for (i in data[1]) {
          console.log(i);
          $(`#${i}`).html(data[1][i] + "%");
        }
      },
    });

    //printing
    document.querySelector("#printid").addEventListener("click", () => {
      const printButton = document.getElementById("printid");
      const printLink = document.getElementById("print-link");

      printButton.addEventListener("click", () => {
        printLink.click();
      });
    });

    document
      .getElementById("dateReport1")
      .addEventListener("click", async () => {
        // console.log("fckjes");
        document.querySelector("#datereportusers").style.display = "block";
        document.querySelector("#datereportposts").style.display = "block";
        var element = document.getElementById("reportPrint");
        await html2pdf(element, {
          margin: 1,
          filename: `report(${document.querySelector("#startDate").value}/${
            document.querySelector("#endDate").value
          }).pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { dpi: 192, letterRendering: true },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        });
        document.querySelector("#datereportusers").style.display = "none";
        document.querySelector("#datereportposts").style.display = "none";
      });
  });
}
