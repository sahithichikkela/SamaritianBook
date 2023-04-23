//OM NAMASHIVAYA

const socket=io("ws://localhost:8900")

sb="http://localhost:3040/"
token=document.cookie.split(';').filter((data)=>{
    return data.indexOf("accessToken")>=0
})[0]
if(token){
    token=token.split("=")
}
if(token && token.length==1){
    token=undefined
}
else if(token && token.length==2){
    token=token[1]
}
waittime=3000
monthmap={
    "Jan":1,
    "Feb":2,
    "Mar":3,
    "Apr":4,
    "May":5,
    "Jun":6,
    "Jul":7,
    "Aug":8,
    "Sep":9,
    "Oct":10,
    "Nov":11,
    "Dec":12
}

var pic1="https://cdn.myportfolio.com/902c73a2c08f2a1033e739e412bf369c/3d155a81-685d-4d18-9fb0-c814b3cb000b_car_1x1.jpg?h=45eb858878ea95660456ca60451331e9"
var pic3="https://www.partfaliaz.com/wp-content/uploads/2018/03/Guihuahuzi-1.jpg"
var pic0="https://media.istockphoto.com/id/1162040662/vector/vector-superhero-silhouette-with-sunburst-effect-background.jpg?s=612x612&w=0&k=20&c=NyvKS97BiIyoZ4Z75Sd7Iptc9BTckQQNep91MGhuRmo="
var pic2="https://t3.ftcdn.net/jpg/05/59/11/04/360_F_559110407_NfJFju7r6802upIi90zIs34xYjM8ZFHx.jpg"
var pic4="https://cdn.dribbble.com/users/1731254/screenshots/14778286/media/186ce5f607806046f4e5c32762eb4938.png?compress=1&resize=400x300&vertical=top"
var pic5="https://img.freepik.com/free-vector/learning-concept-illustration_114360-6186.jpg?w=2000"

var arr=[pic0,pic1,pic2,pic3,pic4,pic5]

//chat routes

function readystate(){
    
    $.ajax({
        url:sb+"index",
        type:"GET",
        headers:{
            token:token
        },
        error:function(err){
            if(err.status==404 || 401){
                window.location.href=err.responseText
            }
        },
        success:function(data){
            document.getElementById("profile:trigger").innerHTML=`<figure>
                                                                        <img src="`+data.profile.profilepic+`" alt="profile picture">
                                                                    </figure>`
            
            $("#headerss").fadeIn("fast")
            $("#footerss").fadeIn("slow")
            document.getElementById("headerss")
            $("#chatarea").hide()
            $("#currname").html(data.profile.name)
            $("#curremail").html(data.profile.email)
            temp=""
            for(friend of data.friendslist){
                temp+=`<button id="`+friend._id+`" name="`+friend._id+`button" onclick='messagess("`+friend._id+`")'>
                <li class="d-flex align-items-center profile-active">

                <div class="profile-thumb" id="`+friend._id+`status">
                    <a id="`+friend._id+`">
                        <figure class="profile-thumb-small" id="`+friend._id+`">
                            <img src="`+friend.profilepic+`" alt="profile picture" id="`+friend._id+`">
                        </figure>
                    </a>
                </div>
                <div class="posted-author" id="`+friend._id+`">                    
                <h6 id="`+friend._id+`" style="text-align:left" >`+friend.name+`</h6>
                    <p id="`+friend._id+`" name="`+friend._id+`">last active 2mins ago</p>
                </div>
            </li></button><br>`
            }
            document.getElementById("friends").innerHTML=temp
            reqs=""
            for(request of data.requestlist){
                reqs+=`<li class="msg-list-item d-flex justify-content-between" id="`+request._id+`friendrequest">
                                                                        <div class="profile-thumb" id="`+request._id+`friendrequest">
                                                                            <figure class="profile-thumb-middle" id="`+request._id+`friendrequest">
                                                                                <img src="`+request.profilepic+`" alt="profile picture" id="`+request._id+`friendrequest">
                                                                            </figure>
                                                                        </div>
                                                                        <div class="msg-content mt-3" id="`+request._id+`friendrequest">
                                                                            <h6 class="author"><a href="genprofile.html" onclick="`+sessionStorage.setItem("oppositeid",request._id)+`">`+request.name+`</a></h6>
                                                                        </div>
                                                                        <div class="mt-3" id="`+request._id+`friendrequest">
                                                                            <button class="btn btn-primary" id="accept" name="`+request._id+`" style="color:black" onclick='accept1(`+JSON.stringify(request)+`)'>accept</button>
                                                                            <button class="btn btn-danger" id="reject" name="`+request._id+`" style="color:black" onclick="reject1()">reject</button>
                                                                        </div>
                                                                    </li>`

            }
            document.getElementById("friendrequests").innerHTML=reqs
            // string_to_date(data.messages[0].time)
            data.messages.sort((a,b)=>{return new Date(a.time)-new Date(b.time)})
            for(text of data.messages){
                if(document.getElementsByName(text.oppositeid+"newmessage").length==0)
                document.getElementById("recentmessagesdropdown").innerHTML=`<li class="msg-list-item d-flex justify-content-between" name="`+text.oppositeid+`newmessage" id="`+text.oppositeid+`"  onclick="execute()">
                                                                                <div class="profile-thumb" id="`+text.oppositeid+`status4">
                                                                                    <figure class="profile-thumb-middle" id="`+text.oppositeid+`">
                                                                                        <img src="`+text.profilepic+`" alt="profile picture" id="`+text.oppositeid+`">
                                                                                    </figure>
                                                                                </div>
                                                                                <div class="msg-content" id="`+text.oppositeid+`">
                                                                                    <h6 class="author" id="`+text.oppositeid+`"><a id="`+text.oppositeid+`">`+text.name+`</a></h6>
                                                                                    <p id="`+text.oppositeid+`">`+text.latest_message+`</p>
                                                                                </div>
                                                                                <div class="msg-time" id="`+text.oppositeid+`">
                                                                                    <p>`+text.time.substr(0,24)+`</p>
                                                                                </div>
                                                                            </li>`+document.getElementById("recentmessagesdropdown").innerHTML
                                                                            
            }
            
            
            for(noti of data.profile.notifications){
                document.getElementById("divnotifications").innerHTML=`<li class="msg-list-item d-flex justify-content-between">
                                                                            <div class="msg-content">
                                                                                <a>`+noti.notificationmessage+`</a>
                                                                            </div>
                                                                            <div class="msg-time">
                                                                                <p>`+noti.time.substr(0,24)+`</p>
                                                                            </div>
                                                                        </li>`+document.getElementById("divnotifications").innerHTML
            }
            socket.emit("adduser",token)
            socket.on("user",user=>{
                $.ajax({
                    url:sb+"getfriendslist",
                    type:"GET",
                    headers:{
                        token:token
                    },
                    error:function(err){
                        if(err.status==400){
                            window.location.href="signup.html"
                        }
                    },
                    success:function(data){
                        for(user of data){
                            if(user.status==="online"){
                                document.getElementById(user._id+"status").className="profile-thumb active"
                                document.getElementsByName(user._id)[0].innerHTML="active"
                                
                                    
                                
                                if(document.getElementById(user._id+"status4"))document.getElementById(user._id+"status4").className="profile-thumb active"
                            }
                            else{
                                document.getElementById(user._id+"status").className="profile-thumb"
                                document.getElementsByName(user._id)[0].innerHTML=`<strong>last active:</strong>`+user.lastactivetime.substr(0,24)
                                
                                    
                                
                                if(document.getElementById(user._id+"status4"))document.getElementById(user._id+"status4").className="profile-thumb"
                            }
                        }
                    }
                })
            })
            
        }
    })
}
socket.on("getmessage",data=>{
    oppositeid=data[1].oppositeid
    username=data[1].name
    message=data[0]
    if(document.getElementById("messages").innerHTML==="send hi to bigin the chat")document.getElementById("messages").innerHTML=""
    
    if(document.getElementById("currchatid").innerHTML==oppositeid){
        document.getElementById("messages").innerHTML+=`<li class="text-friends">
                    <p>`+message+`</p>
                    <div class="message-time">`+new Date().toString().substr(0,24)+`</div>
                </li>`
    }   
    else{
        text=data[1]
        document.getElementsByName(text.oppositeid+"newmessage")[0].remove()
        document.getElementById("recentmessagesdropdown").innerHTML=`<li class="msg-list-item d-flex justify-content-between" name="`+text.oppositeid+`newmessage" id="`+text.oppositeid+`"  onclick="execute()">
                                                                                <div class="profile-thumb active" id="`+text.oppositeid+`status4">
                                                                                    <figure class="profile-thumb-middle" id="`+text.oppositeid+`">
                                                                                        <img src="`+text.profilepic+`" alt="profile picture" id="`+text.oppositeid+`">
                                                                                    </figure>
                                                                                </div>
                                                                                <div class="msg-content" id="`+text.oppositeid+`">
                                                                                    <h6 class="author" id="`+text.oppositeid+`"><a id="`+text.oppositeid+`">`+text.name+`</a></h6>
                                                                                    <p id="`+text.oppositeid+`">`+message+`</p>
                                                                                </div>
                                                                                <div class="msg-time" id="`+text.oppositeid+`">
                                                                                    <p>`+text.time+`</p>
                                                                                </div>
                                                                            </li>`+document.getElementById("recentmessagesdropdown").innerHTML
        document.getElementById("recentmessages").click()
        timer2=setTimeout(()=>{
            document.getElementById("recentmessages").click()
        },waittime)                                                                
    }
})

function clearcurrchatid(){
    document.getElementById("currchatid").innerHTML=""
    $("#chatarea").fadeOut(1000)
}
function execute(){
    sessionStorage.setItem("oppositeid",event.target.id)
    messagess()
}
function getallnotifications1(){
    document.getElementById("profile:trigger").click()
    document.getElementById("notifications").click()
    document.getElementById("notifications").click()
}
function getallnotifications(){

    $("#addnewnotifications").fadeOut("slow")
    $("#divnotifications").fadeIn("slow")
}
function backtonewnotifications(){
    $("#divnotifications").fadeOut("slow")
    $("#addnewnotifications").fadeIn("slow")
}
function sendmessage(){
    var message=$("#messagebox").val()
    if(message){
        if(document.getElementById("messages").innerHTML==="send hi to bigin the chat")document.getElementById("messages").innerHTML=""
        document.getElementById("messages").innerHTML+=`<li class="text-author">
                        <p>`+message+`</p>
                        <div class="message-time">`+new Date().toString().substr(0,24)+`</div>
                    </li>`
        document.getElementById("messagebox").value=""
        socket.emit("sendmessage",[token,document.getElementById("currchatid").innerHTML,message])
    }
}
$(document).ready(()=>{
    $("#facerecog").submit(function(){
        event.preventDefault()
        var data=new FormData($("#facerecog")[0])
        $.ajax({
            url:sb+"uploadtos3",
            type:'POST',
            headers:{
                token:token
            },
            contentType: false,
            processData:false,
            enctype:"multipart/form-data",
            cache:false,
            data : data,
            success:function(data){
                console.log(data)
                data=JSON.parse(data)
                console.log(data.faces[0].age)
                age=parseInt(data.faces[0].age)
                $("#picinput").fadeOut("slow")
                object=JSON.parse(sessionStorage.getItem("object"))
                
                flag=0
                if(object.type=="parent" && age<=18){
                    document.getElementById("submitform").innerHTML="you are a parent and your age is less than 18 details not allowed"
                    flag=1
                }
                else if(object.type=="children" && age>18){
                    document.getElementById("submitform").innerHTML="you are a children and your age is more than 18 details not allowed"
                    flag=1
                }
                console.log(age,object.type,age)
                $.ajax({
                    url:sb+"rejectprofile",
                    type:"POST",
                    headers:{token:token},
                    contentType:"application/json",
                    data:JSON.stringify({
                        obj:sessionStorage.getItem("object"),
                        value:flag
                    }),success:function(data){
                        sessionStorage.removeItem("object")
                        if(flag==0){document.getElementById("submitform").innerHTML="account successfully creted redirecting to login page"}
                    }
                })
                var timer2=setTimeout(()=>{
                    window.location.href="signup.html"
                },4000)
            }
        })
    })
})
async function submitpic(){
    var image=document.getElementById("tempimage").src
     document.getElementById("download").href=image
     document.getElementById("download").click()
    
}
function messagess(data=""){
    if(data){
        sessionStorage.setItem("oppositeid",(data))
    }
    $.ajax({
        url:sb+"getuser",
        type:"GET",
        headers:{
            token:token,
             oppositeid:sessionStorage.getItem("oppositeid")
        },
        success:function(data){
            openchat(data)
        }
    })
}   
function openchat(param=""){
    document.getElementById("cli").click()
    reqobj=param
    document.getElementById("currchatid").innerHTML=reqobj._id
    sessionStorage.setItem("oppositeid",reqobj._id)
    $("#chatarea").fadeIn(1000)
    if(reqobj.status==="online"){
        document.getElementById("status3").innerHTML=`active`
        document.getElementById("status2").className="profile-thumb active"
    }
    else{
        document.getElementById("status3").innerHTML=reqobj.lastactivetime.substr(0,24)
        document.getElementById("status2").className="profile-thumb"
    }
    $.ajax({
        url:sb+"messages",
        type:"GET",
        headers:{
            token:token,
            oppositeid:reqobj._id
        },
        success:function(data){
            oppositeid=reqobj._id
            copy=data
            data=data[0]
            _str=""
            if(copy[0]==="bigin chat"){
                document.getElementById("messages").innerHTML=`send hi to bigin the chat`
            }
            else{
                for(message of data.messages){
                    if(message.senderid===oppositeid){
                        _str+=`<li class="text-friends">
                        <p>`+message.message+`</p>
                        <div class="message-time">`+message.time.substr(0,24)+`</div>
                    </li>`
                    }
                    else{
                        _str+=`<li class="text-author">
                        <p>`+message.message+`</p>
                        <div class="message-time">`+message.time.substr(0,24)+`</div>
                    </li>`
                    }
                }
                document.getElementById("messages").innerHTML=_str
            }
            
        }
    })
    $("#oppositename").html(reqobj.name)
}

socket.on("requestaccepted",data=>{
    friend=data
    document.getElementById("addnewnotifications").innerHTML=`<li class="msg-list-item d-flex justify-content-between">
                                                                    <div class="msg-content notification-content" style="width:80%">
                                                                        <a>`+data.name+` has accepted your friend request</a>
                                                                        <a></a>
                                                                    </div>
                                                                    <div class="msg-time">
                                                                        <p>`+new Date().toString().substr(0,24)+`</p>
                                                                    </div>
                                                                </li>`+document.getElementById("addnewnotifications").innerHTML
    document.getElementById("notifications").click();
    timer2 = setTimeout(() => {
        document.getElementById("notifications").click();
    }, waittime);
})
function accept(data){
    socket.emit("acceptrequest",[token,sessionStorage.getItem("oppositeid")])
    $("#acceptsss").fadeOut("slow")
    $("#rejectsss").fadeOut("slow")
    timer2=setTimeout(()=>{
        $("#message").fadeIn("slow")
    },1000)
}
function accept1(friend){
    socket.emit("acceptrequest",[token,sessionStorage.getItem("oppositeid")])
    document.getElementById("reject").style.display="none"
    document.getElementById("accept").innerHTML="accepted"
    document.getElementById("accept").disabled=true
    document.getElementById(friend._id+"friendrequest").style.transition="1s"
    document.getElementById(friend._id+"friendrequest").style.opacity=0
    timer2=setTimeout(()=>{
        document.getElementById(friend._id+"friendrequest").remove()
    },1000)
}
socket.on("requestsent",(request)=>{
    document.getElementById("friendrequests").innerHTML+=`<li class="msg-list-item d-flex justify-content-between" id="`+request._id+`friendrequest">
                                                                    <div class="profile-thumb active" id="`+request._id+`friendrequest">
                                                                        <figure class="profile-thumb-middle" id="`+request._id+`friendrequest">
                                                                            <img src="`+request.profilepic+`" alt="profile picture" id="`+request._id+`friendrequest">
                                                                        </figure>
                                                                    </div>
                                                                    <div class="msg-content mt-3" id="`+request._id+`friendrequest">
                                                                        <h6 class="author"><a href="genprofile.html" onclick="`+sessionStorage.setItem("oppositeid",request._id)+`">`+request.name+`</a></h6>
                                                                    </div>
                                                                    <div class="mt-3" id="`+request._id+`friendrequest">
                                                                        <button class="btn btn-primary" id="accept" name="`+request._id+`" style="color:black" onclick='accept1(`+JSON.stringify(request)+`)'>accept</button>
                                                                        <button class="btn btn-danger" id="reject" name="`+request._id+`" style="color:black" onclick="reject1()">reject</button>
                                                                    </div>
                                                                </li>`  
    document.getElementById("addnewnotifications").innerHTML=`<li class="msg-list-item d-flex justify-content-between">
                                                                    <div class="msg-content notification-content" style="width:80%">
                                                                        <a>You have a new Friend request from `+request.name+`</a>
                                                                    </div>
                                                                    <div class="msg-time">
                                                                        <p>`+new Date().toString().substr(0,24)+`</p>
                                                                    </div>
                                                                </li>`+document.getElementById("addnewnotifications").innerHTML
    document.getElementById("notifications").click();
    timer2 = setTimeout(() => {
        document.getElementById("notifications").click();
      }, waittime);
})
function sendrequest(){
    $("#sendreq").fadeOut("slow")
    $("#sendreq").html("request sent")
    $("#sendreq").fadeIn("slow")
    document.getElementById("sendreq").disabled=true
    socket.emit("sendrequest",[token,sessionStorage.getItem("oppositeid")])
    
}
if(window.location.href.indexOf("/genprofile.html")>=0){
    $(document).ready(function(){
        readystate()
        $.ajax({
            url:sb+"getgenprofile",
            type:"GET",
            headers:{
                token:token,
                oppositeid:sessionStorage.getItem("oppositeid")
            },
            success:function(data){
                copy=data
                $("#maindiv").fadeIn("slow")
                data=data.data
                if(copy==="myprofile"){
                    window.location.href="profile.html"
                }
                else{
                    $("#username").html(data.name)
                    $("#bodypart").fadeIn("slow")
                    document.getElementById("cpdisplay").innerHTML+=` <div class="profile-banner-large bg-img" name="coverpic" >
                    <img style="width:1920px;height:350px" src="`+data.coverpic+`">
                    </div>
                
                    `
                    document.getElementById("ppdisplay").innerHTML+=`
                    <div class="profile-picture-box"  >
                    <figure class="profile-picture">
                        <a href="profile.html" >
                            <img style="width:270px;height:270px" src="`+data.profilepic+`"  alt="profile picture"> 
                        </a>
                    </figure>
                </div>`
                    $("#hobbies1").val(data.hobbies[0])
                    $("#hobbies2").val(data.hobbies[1])
                    $("#hobbies3").val(data.hobbies[2])
                    $("#userlocation").val(data.location)
                    $("#somethingaboutme").html(data.somethingaboutme)
                    $("#education").html(data.education)
                }
                if(copy.buttonstatus==="Request sent"){
                    document.getElementById("sendreq").disabled=true
                    document.getElementById("acceptsss").style.display="none"
                    document.getElementById("rejectsss").style.display="none"
                    document.getElementById("message").style.display="none"
                    document.getElementById("sendreq").innerHTML=copy.buttonstatus
                    if(copy.time){
                        document.getElementById("information").style.display="block"
                        document.getElementById("information").innerHTML=`Request sent on `+copy.time.substr(0,24)
                    }
                }
                if(copy.buttonstatus==="acceptreject"){
                    document.getElementById("sendreq").style.display="none"
                    document.getElementById("message").style.display="none"
                    if(copy.time){
                        document.getElementById("information").style.display="block"
                        document.getElementById("information").innerHTML=`Request received on `+copy.time.substr(0,24)
                    }

                }
                if(copy.buttonstatus==="send req"){
                    document.getElementById("acceptsss").style.display="none"
                    document.getElementById("rejectsss").style.display="none"
                    document.getElementById("message").style.display="none"
                }
                if(copy.buttonstatus==="request accepted"){
                    document.getElementById("acceptsss").style.display="none"
                    document.getElementById("rejectsss").style.display="none"
                    document.getElementById("sendreq").style.display="none"
                }
            }
        })
    })
}


function genprofile(){
    sessionStorage.setItem("oppositeid",event.target.id)
    window.location.href="genprofile.html"
}

function searchfriends(){
    var text=$("#search").val()
    $.ajax({
        url:sb+"searchfriends",
        type:"GET",
        headers:{token:token,text:text},
        success:(data)=>{
            _str=""
            document.getElementById("requests").style.display="none"
            for (i of data){
               _str+=`<li class="" style="display:flex">
                <div class="profile-thumb mb-3">
                    <figure class="profile-thumb-middle">
                        <img src="`+i.profilepic+`" alt="profile picture">
                    </figure>
                </div>
               
                <div class="msg-content mt-3 pl-4" >
                    <h6 class="author"><a id="`+i._id+`" class="pl-4" onclick="genprofile()">`+i.name+`</a></h6>
                </div>
             
            </li>`
            }
            document.getElementById("requests").innerHTML=_str
            $("#requests").fadeIn("slow")
        }
    


    })
}



// //user calls/////////////////////////////




function vemail(email){
    v=0
    var mailformat = /\S+@\S+\.\S+/;
    if (email.match(mailformat)) {
        v=1
    } 
    else {
    
    msg = "You have entered an invalid email address!";
    const y = document.getElementById("emailerr");

    y.innerHTML = msg;

    y.style.display = "block";

    }

    return v
}

//parentemail
function vpemail(email){
    v=0
    var mailformat = /\S+@\S+\.\S+/;
    if (email.match(mailformat)) {
        v=1
    } 
    else {
    
    msg = "You have entered an invalid email address!";
    const y = document.getElementById("pemailerr");

    y.innerHTML = msg;

    y.style.display = "block";

    }

    return v
}
          
        
          
        
      
//for name
function vname(name) {
  v = 0;
  console.log(name)

  if (name.length>0) {
    v = 1;
    
  } else {
    msg = "Enter a name!";
    const y = document.getElementById("nameerr");

    y.innerHTML = msg;

    y.style.display = "block";
    
  }
  return v
}
      
  
 //for cpass
function vpass(upw) {
          
          var lowerCaseLetters = /[a-z]/g;
          var upperCaseLetters = /[A-Z]/g;
          var numbers = /[0-9]/g;
          var flag = 0;
          msg = "";
      
          if (upw.length == 0) {
            msg += " Please fill in password";
            msg += `<br>`;
          }
          if (upw.length < 8) {
            msg += " Min of 8 characters required";
            msg += `<br>`;
          }
          if (!upw.match(numbers)) {
            msg += " Please add 1 number";
            msg += `<br>`;
          }
          if (!upw.match(upperCaseLetters)) {
            msg += " Please add 1 uppercase letter";
            msg += `<br>`;
          }
          if (!upw.match(lowerCaseLetters)) {
            msg += " Please add 1 lowercase letter";
            msg += `<br>`;
          }
          if (
            upw.length > 7 &&
            upw.match(numbers) &&
            upw.match(upperCaseLetters) &&
            upw.match(lowerCaseLetters)
          ) {
            flag = 1;
            return flag;
          }
          const y = document.getElementById("passerr");
          y.innerHTML = msg;
          y.style.display = "block";
          return flag;
}
      

///confirmpass
function vcpass(e1, e2) {
    flag=0
    if (e1 == e2) {
    flag = 1;
    return flag;
    } else {
    msg = "Your Passwords dont match!";
    const y = document.getElementById("cpasserr");

    y.innerHTML = msg;

    y.style.display = "block";
    return flag;
    }
}
    
//////type

function vtype(type) {
    v=0

    if (type=="parent"||type=="children") {
        v = 1;
        
    } else {
        msg = "Select account type!";
        const y = document.getElementById("typeerr");

        y.innerHTML = msg;

        y.style.display = "block";
        
    }
    return v
}
    
function vgender(gender) {
    v = 0;

    if (gender=="male"||gender=="female") {
        v = 1;
        
    } else {
        msg = "Select your Gender!";
        const y = document.getElementById("gendererr");

        y.innerHTML = msg;

        y.style.display = "block";
        
    }
    return v
}

function vage(type,age) {
    v = 0;
  
    if ((type=="parent" && age>24) || (type=="children" && age<18) ) {
      v = 1; 
    } 


    
    else {
      msg = "Enter right age!";
      const y = document.getElementById("ageerr");
  
      y.innerHTML = msg;
  
      y.style.display = "block";
      
    }
    return v
}


function vaadhar(aadharid) {
    v = 0;
  
    if (aadharid!="" ) {
      v = 1; 
    } 

    else {
      msg = "Please upload your child's aadhar!";
      const y = document.getElementById("aadharerr");
  
      y.innerHTML = msg;
  
      y.style.display = "block";
      
    }
    return v
}


function vlocation(location) {
    v = 0;
  
    if (location.length>4) {
      v = 1;
      
    } else {
      msg = "Enter your location!";
      const y = document.getElementById("locationerr");
  
      y.innerHTML = msg;
  
      y.style.display = "block";
      
    }
    return v
}
        



if(window.location.href.indexOf("signup.html")>=0){
    $(document).ready(function(){
        $.ajax({
            url:sb+"login",
            type:"GET",
            headers:{
                token:token
            },
            error:function(err){
                if(err.status==400 || 401)window.location.href=err.responseText
            },
            success:function(data){
            }
        })
    })
}




$(document).ready(()=>{
        
        $("#signupdata").submit(function(){
            event.preventDefault()
            var data=new FormData($("#signupdata")[0])
            var email=document.getElementById("email").value
            var e1=vemail(email)

            var name=document.getElementById("name").value
            var e2=vname(name)

            var password=document.getElementById("password").value
            var e3=vpass(password)

            var cpassword=document.getElementById("cpassword").value
            var e4=vcpass(password,cpassword)

            var parentemail=document.getElementById("parentemail").value
            var e5=vpemail(parentemail)

            var type=document.getElementById("type").value
            var e6=vtype(type)

            var age=document.getElementById("age").value
            var e7=vage(type,age)

            var gender=document.getElementById("gender").value
            var e8=vgender(gender)

            var aadharid=document.getElementById("aadharid").value
            var e9=vaadhar(aadharid)

            var location=document.getElementById("location").value
            var e10=vlocation(location)



            v=e1*e2*e3*e4*e5*e6*e7*e8*e9*e10
            console.log(v)
            if (v==1){
                $.ajax({
                    url:sb+"signup",
                    type:'POST',
                    headers:{
                        token:token
                    },
                    contentType: false,
                    processData:false,
                    enctype:"multipart/form-data",
                    cache:false,
                    headers:{token:token},
                    data : data,
                    success:function(k){
                        sessionStorage.setItem("object",JSON.stringify(k))
                        window.location.href="list.html"
                    }
                })

            }
          
           
       
        })
    
})




function logout(){
    var Cookies = document.cookie.split(';');
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
    window.location.href="signup.html"

}
function login(){
    type=$("#logintype").val()
    if(type == "admin"){
        console.log("dcf");
        $.ajax({
            url:sb+"adminlogin",
            type:"POST",
            contentType:"application/json",
            data:JSON.stringify({
                email:$("#loginemail").val(),
                password:$("#loginpassword").val(),
                type:$("#logintype").val()
            }),
            success:(data)=>{
                console.log(data,"fghjkl")
                document.cookie="accessToken="+data[0]
                window.location.href="/template/adminDashBoard.html"
            },
            error:(data)=>{
                window.location.href="signup.html"
            }
        })
    }
    else if(type=="children"){
        $.ajax({
            url:sb+"childlogin",
            type:"POST",
            contentType:"application/json",
            data:JSON.stringify({
                email:$("#loginemail").val(),
                password:$("#loginpassword").val(),
                type:$("#logintype").val()
            }),
            success:(data)=>{
                document.cookie="accessToken="+data[0]
                $.ajax({
                    type:"POST",
                    url:sb+"sendparentemail",
                    headers:{
                        token:token
                    },
                    contentType:"application/json",
                    data:JSON.stringify({
                        email:$("#loginemail").val(),
                        
                        }),
                    
                    success:(data)=>{
                        window.location.href="index.html"
                    }
                })
                window.location.href="index.html"
            }
        })
    }
    else{
        $.ajax({
            url:sb+"parentlogin",
            type:"POST",
            contentType:"application/json",
            data:JSON.stringify({
                email:$("#loginemail").val(),
                password:$("#loginpassword").val(),
                type:$("#logintype").val()
            }),
            success:(data)=>{
                document.cookie="accessToken="+data[0]
                window.location.href="p-index.html"

            }
        })
    }
}

socket.on("liked",(data)=>{
    document.getElementById("addnewnotifications").innerHTML=`<li class="msg-list-item d-flex justify-content-between">
                                                                <div class="msg-content notification-content" style="width:80%">
                                                                    <a>`+data[0]+` has `+data[1]+` your post just now</a>
                                                                    <a></a>
                                                                </div>
                                                                <div class="msg-time">
                                                                    <p>`+new Date().toString().substr(0,24)+`</p>
                                                                </div>
                                                            </li>`+document.getElementById("addnewnotifications").innerHTML
    document.getElementById("notifications").click()
    var timer2=setTimeout(()=>{
        document.getElementById("notifications").click()
    },waittime)
})
socket.on("commented",(data)=>{
    document.getElementById("addnewnotifications").innerHTML=`<li class="msg-list-item d-flex justify-content-between">
                                                                <div class="msg-content notification-content" style="width:80%">
                                                                    <a>`+data+` commented on your post just now</a>
                                                                    <a></a>
                                                                </div>
                                                                <div class="msg-time">
                                                                    <p>`+new Date().toString().substr(0,24)+`</p>
                                                                </div>
                                                            </li>`+document.getElementById("addnewnotifications").innerHTML
    document.getElementById("notifications").click()
    var timer2=setTimeout(()=>{
        document.getElementById("notifications").click()
    },waittime)
})
function liked(copy){
    copy=copy.split(":")
    id=copy[0]
    length=copy[1]
    var img=document.getElementById(id+"0").src
    if(img.indexOf("assets/images/icons/heart-color.png")>=0){
        document.getElementById(id+"0").src="assets/images/icons/heart.png"
        document.getElementById(id+"0").name="0"
        var len=parseInt(length)
        document.getElementById(id+"hiii").innerHTML=len+" people liked the post"
    }
    else{
        document.getElementById(id+"0").src="assets/images/icons/heart-color.png"
        document.getElementById(id+"0").name="1"
        var len=Math.abs(parseInt(length))
        document.getElementById(id+"hiii").innerHTML="You and "+len+" people liked the post"
    }
    if(window.location.href.indexOf("childmorally.html")>=0 || window.location.href.indexOf("index.html")>=0){
        $.ajax({
            url:sb+"postliked",
            type:"POST",
            headers:{
                token:token
            },
            contentType:"application/json",
            data:JSON.stringify({
                number:document.getElementById(id+"0").name,
                postid:id
            })
        })
    }
    else{
        $.ajax({
            url:sb+"ppostliked",
            type:"POST",
            headers:{
                token:token
            },
            contentType:"application/json",
            data:JSON.stringify({
                number:document.getElementById(id+"0").name,
                postid:id
            })
        })
    }
    socket.emit("like",[id,document.getElementById(id+"0").name])
}
function comment(data){
    document.getElementById(data+"newdiv").style.transition="0.5s"
    document.getElementById(data+"newdiv").style.display="block"
}
function postcomment(data){
    socket.emit("postcomment",[token,document.getElementById(data+"commentvalue").value,data])
}
if(window.location.href.indexOf("/index.html")>=0){
    $(document).ready(function(){
        readystate()
        $("#maindiv").fadeIn("slow")
        $.ajax({
            url:sb+"getindexpage",
            type:"GET",
            headers:{
                token:token
            },
            success:function(data){
                console.log(data)
                for(i of data.posts){
                    propic=i[0]
                    for(var j=1;j<i.length;j++){
                        var len=(i[j].likedby.length).toString()
                        document.getElementById("postarea").innerHTML+=`<div class="card ">
                    <!-- post title start -->
                    <div class="post-title d-flex align-items-center">
                        <!-- profile picture end -->
                        <div class="profile-thumb">
                            <a href="#">
                                <figure class="profile-thumb-middle">
                                    <img src="`+propic+`" alt="profile picture">
                                </figure>
                            </a>
                        </div>
                        <!-- profile picture end -->
  
                        <div class="posted-author">
                            <h6 class="author"><a href="profile.html">`+i[j].postedby+`</a></h6>
                            <span class="post-time">`+i[j].time.substr(3,18)+`</span>
                        </div>
                    </div>
                    <!-- post title start -->
                    <div class="post-content">
                        <p class="post-desc">
                            `+i[j].posttext+`
                        </p>
                        <div class="post-thumb-gallery">
                            <figure class="post-thumb img-popup">
                                <a href="`+i[j].image+`">
                                    <img src="`+i[j].image+`" alt="post image">
                                </a>
                            </figure>
                        </div>
                        <div class="post-meta">
                            <button class="like-button d-flex" >
                                <img class="" id="`+i[j]._id+`0"  name="0" src="assets/images/icons/heart.png" alt="" onclick='liked("`+i[j]._id+":"+len+`")'>
                                <p style="padding-left: 3px;" id="`+i[j]._id+`hiii"> people liked</p>
                            </button>
                            <ul class="comment-share-meta">
                                <li>
                                    <button class="post-comment" onclick='comment("`+i[j]._id+`")'>
                                        <i class="bi bi-chat-bubble"></i>
                                        <span id="`+i[j]._id+`numberofcomments">41</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div id="`+i[j]._id+`newdiv" style="display:none">
                                <div class="d-flex">
                                    <input class="form-control" type="text" id="`+i[j]._id+`commentvalue">
                                    <button class="bg-danger" style="border-radius:10px" onclick='postcomment("`+i[j]._id+`")'>comment</button>
                                </div>
                                <br>
                                <div>
                                    <ul id="`+i[j]._id+`comments" style="border:1px solid rgb(142, 131, 131);border-radius: 10px;"><br>
                                    </ul>
                                </div>
                            </div>
                    </div>
                </div>`
                document.getElementById(i[j]._id+"numberofcomments").innerHTML=i[j].comments.length
                for(kom of i[j].comments){
                    console.log(kom);
                    document.getElementById(i[j]._id+"comments").innerHTML=`<li class="unorder-list">
                    <div class="profile-thumb">
                        <a>
                            <figure class="profile-thumb-small">
                                <img src="`+i[j].image+`" alt="profile picture">
                            </figure>
                        </a>
                    </div>
                    <div class="unorder-list-info">
                        <h3 class="list-title"><a>`+kom.name+`</a></h3>
                        <p class="list-subtitle"><a href="#">`+kom.commentmessage+`</a></p>
                    </div>
                    <p class="like-button" style="font-size:medium">
                    `+kom.time.substr(3,18)+`
                    </p>
                </li>
                <br>`+document.getElementById(i[j]._id+"comments").innerHTML
                }
                if(data.profile.likedposts.includes(i[j]._id)){
                    document.getElementById(i[j]._id+"0").src="assets/images/icons/heart-color.png"
                    document.getElementById(i[j]._id+"hiii").innerHTML="you and "+i[j].likedby.length+" people liked the post"
                }
                else{
                    document.getElementById(i[j]._id+"0").src="assets/images/icons/heart.png"
                    document.getElementById(i[j]._id+"hiii").innerHTML=i[j].likedby.length+" people liked the post"
                }
                    }
                }
                for(i of data.nonfriends){
                    document.getElementById("nonfriends").innerHTML+=`<li class="unorder-list">
                    <!-- profile picture end -->
                    <div class="profile-thumb">
                        <a>
                            <figure class="profile-thumb-small">
                                <img src="`+i.profilepic+`" alt="profile picture">
                            </figure>
                        </a>
                    </div>
                    <div class="unorder-list-info">
                        <h3 class="list-title"><a>`+i.name+`</a></h3>
                        <p class="list-subtitle"><a href="#">`+i.lastactivetime.substr(3,18)+`</a></p>
                    </div>
                    <button class="like-button">
                        <button class="bg-danger" style="border-radius:30%" id="`+i._id+`" onclick="viewprofile()">view profile</button>
                    </button>
                </li>`
                }
                for(i of data.notifications){
                    document.getElementById("xnotifications").innerHTML+=`<li class="unorder-list">      
                    <div class="unorder-list-info">
                        <h3 class="list-title"><a>`+i.notificationmessage+`</a></h3>
                        <p class="list-subtitle">`+i.time.substr(3,18)+`</p>
                    </div>
                </li>`
                }
            }
        })
    })
}
function viewprofile(){
    sessionStorage.setItem("oppositeid",event.target.id)
    window.location.href="genprofile.html"
}



////calls callss////

async function createOffer(peer){
    const offer=await peer.createOffer()
    return offer
}

async function video(){
    window.location.href="videocall.html"
}
function phone(){
    window.location.href="audiocall.html"
}
socket.on("callrequests",async (data)=>{
    sessionStorage.setItem("oobj",JSON.stringify(data[0]))
    sessionStorage.setItem("offer",JSON.stringify(data[1]))
    sessionStorage.setItem("oppositeid",data[0]._id)
    window.location.href=data[2]
})
var peer=new RTCPeerConnection({
    iceServers:[{
        urls:[
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478"
        ]
    }]
})
var peer2=new RTCPeerConnection({
    iceServers:[{
        urls:[
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478"
        ]
    }]
})
if(window.location.href.indexOf("videocall.html")>=0){
    $(document).ready(function(){
        readystate()
        $("#maindiv").fadeIn("slow")
        $.ajax({
            url:sb+"getuser",
            type:"GET",
            headers:{
                token:token,
                oppositeid:sessionStorage.getItem("oppositeid")
            },
            success:async function(oppositeobj){
                var oobj=JSON.parse(sessionStorage.getItem("oobj"))
                if(!oobj){                    
                    $("#username").html(`calling  <img src="fasdf" width="40px" height="px" style="border-radius:100%" alt="" id="profilepicture">`+oppositeobj.name+`...`)
                    $("#anser").hide()
                    document.getElementById("profilepicture").src=(oppositeobj.profilepic)
                    const offer=await peer.createOffer()
                    sessionStorage.setItem("offer",JSON.stringify(offer))
                    $("#videoon").fadeIn("slow")
                    socket.emit("callrequest",[token,oppositeobj._id,offer,"videocall.html"])
                    
                }
                else{
                    $("#username").html(`Incoming call from   <img src="fasdf" width="40px" height="40px" alt="" style="border-radius:100%" id="profilepicture">`+oobj.name+`...`)
                    document.getElementById("profilepicture").src=oobj.profilepic
                }
            }            
        })        
    })
}

if(window.location.href.indexOf("audiocall.html")>=0){
    $(document).ready(function(){
        readystate()
        $("#maindiv").fadeIn("slow")
        $.ajax({
            url:sb+"getuser",
            type:"GET",
            headers:{
                token:token,
                oppositeid:sessionStorage.getItem("oppositeid")
            },
            success:async function(oppositeobj){
                var oobj=JSON.parse(sessionStorage.getItem("oobj"))
                if(!oobj){                    
                    $("#username").html(`calling  <img src="fasdf" width="40px" height="px" style="border-radius:100%" alt="" id="profilepicture">`+oppositeobj.name+`...`)
                    $("#anser").hide()
                    document.getElementById("profilepicture").src=(oppositeobj.profilepic)
                    const offer=await peer.createOffer()
                    sessionStorage.setItem("offer",JSON.stringify(offer))
                    $("#videoon").fadeIn("slow")
                    socket.emit("callrequest",[token,oppositeobj._id,offer,"audiocall.html"])
                    
                }
                else{
                    $("#username").html(`Incoming call from   <img src="fasdf" width="40px" height="40px" alt="" style="border-radius:100%" id="profilepicture">`+oobj.name+`...`)
                    document.getElementById("profilepicture").src=oobj.profilepic
                }
            }            
        })        
    })
}




peer.ontrack = (e) => {
    console.log(e.track)
    document.getElementById("videostream2").srcObject = e.streams[0];
    return false;
  };
socket.on("negansers",async(data)=>{
    peer.setRemoteDescription(data)
    console.log(peer)
})
socket.on("negcallrequests",async(data)=>{
    peer.setRemoteDescription(data)
    var anser=await peer.createAnswer(data)
    peer.setLocalDescription(anser)
    
    socket.emit("neganser",[token,sessionStorage.getItem("oppositeid"),anser])

})
peer.addEventListener('negotiationneeded',async()=>{
    var offer=await peer.createOffer()
    peer.setLocalDescription(offer)
    socket.emit("negcallrequest",[token,sessionStorage.getItem("oppositeid"),offer])
})
socket.on("negcallrequests")
socket.on("call-accepted",async (data)=>{
    const anser=data[1]
    sessionStorage.setItem("anser",JSON.stringify(anser))
    const offer=JSON.parse(sessionStorage.getItem("offer"))
    $("#username").html(`call connected with `+data[0])
    await peer.setLocalDescription(offer)
    await peer.setRemoteDescription(anser)
    sessionStorage.removeItem("offer")
    sessionStorage.removeItem("anser")
})
function stopVideoOnly(stream) {
    stream.getTracks().forEach(function(track) {
        if (track.readyState == 'live' && track.kind === 'video') {
            track.stop();
        }
    });
}
async function onvideo(){
    var stream=await navigator.mediaDevices.getUserMedia({
        video:true,
        audio:true
    })
    if(document.getElementById("videoon").name==="0"){
        document.getElementById("videoon").name="1"
        document.getElementById("videoon").innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="50" height="30" fill="currentColor" class="bi bi-camera-video-off-fill" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M10.961 12.365a1.99 1.99 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 3H4.272l6.69 9.365zm-10.114-9A2.001 2.001 0 0 0 0 5v6a2 2 0 0 0 2 2h5.728L.847 3.366zm9.746 11.925-10-14 .814-.58 10 14-.814.58z"/>
  </svg>`
        document.getElementById("videostream").srcObject=stream
        for (const track of stream.getTracks()) {
            console.log(document.getElementById("videoon").name)
            peer.addTrack(track, stream);
            console.log(peer)
        }

    }
    else{
        console.log("hello")
        document.getElementById("videoon").name="0"
        document.getElementById("videoon").innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="50" height="30" fill="currentColor" class="bi bi-camera-video-fill" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5z"/>
      </svg>`
        console.log(stream)
        temp=document.getElementById("videostream")
        temp.srcObject.getVideoTracks().forEach(track => {
            console.log(track)
            track.enabled=false
          });
    }
}
async function onaudio(){
    var stream=await navigator.mediaDevices.getUserMedia({
        audio:true
    })
    if(document.getElementById("videoon").name==="0"){
        console.log(document.getElementById("videoon").name)
        document.getElementById("videoon").name="1"
        document.getElementById("videoon").innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="50" height="30" fill="currentColor" class="bi bi-mic-mute-fill" viewBox="0 0 16 16">
        <path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4.02 4.02 0 0 0 12 8V7a.5.5 0 0 1 1 0v1zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a4.973 4.973 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4zm3-9v4.879L5.158 2.037A3.001 3.001 0 0 1 11 3z"/>
        <path d="M9.486 10.607 5 6.12V8a3 3 0 0 0 4.486 2.607zm-7.84-9.253 12 12 .708-.708-12-12-.708.708z"/>
      </svg>`
        document.getElementById("videostream").srcObject=stream
        for (const track of stream.getTracks()) {
            peer.addTrack(track, stream);
        }

    }
    else{
        console.log("hello")
        console.log(document.getElementById("videoon").name)
        document.getElementById("videoon").name="0"
        document.getElementById("videoon").innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="50" height="30" fill="currentColor" class="bi bi-mic-fill" viewBox="0 0 16 16">
        <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z"/>
        <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
      </svg>`
        console.log(stream)
        temp=document.getElementById("videostream")
        temp.srcObject.getVideoTracks().forEach(track => {
            console.log(track)
            track.enabled=false
          });
    }
}
// async function onaudio(){
//     console.log("asd;flkj")
//     vid=document.getElementById("videostream")
//     navigator.mediaDevices.getUserMedia({
//         audio: true,
//      }).then((stream) => {
//         if (! vid.srcObject) {
//            vid.srcObject = stream;
//         }
//         for (const track of stream.getTracks()) {
            
//             peer.addTrack(track, stream);
//           }
//      });
// }
async function anser(){
    $("#videoon").fadeIn("slow")
    offer=JSON.parse(sessionStorage.getItem("offer"))
    data={}
    data.oppositeid=sessionStorage.getItem("oppositeid")
    data.token=token
    var obj=JSON.parse(sessionStorage.getItem("oobj"))
    $("#username").html(`call connected with `+obj.name)
    $("#anser").hide()
    await peer.setRemoteDescription(offer)
    data.anser=await peer.createAnswer(offer)
    await peer.setLocalDescription(data.anser)
    sessionStorage.removeItem("offer")
    sessionStorage.removeItem("oobj")
    socket.emit("anserd-call",data)
}
socket.on("disconnectcalls",(data)=>{
    sessionStorage.removeItem("oobj")
    sessionStorage.removeItem("anser")
    sessionStorage.removeItem("oppositeid")
    sessionStorage.removeItem("offer")
    history.go(-1)
})
function noanser(){
    socket.emit("disconnectcall",[token,sessionStorage.getItem("oppositeid")])
    sessionStorage.removeItem("oobj")
    sessionStorage.removeItem("anser")
    sessionStorage.removeItem("oppositeid")
    sessionStorage.removeItem("offer")
    history.go(-1)
}






///////////////////////////calls callsss////////////////////////
function allprofiles(){
    $.ajax({
        url:sb+"getuserprofiledetails",
        type:"GET",
        headers:{
            token:token
        },
        success:function(data){
            all=""
            
            $("#friendslist").fadeOut("3000")
            document.getElementById("friendslist").style.display="none"
            totalnumber=0
            document.getElementById("numberoffriends").style.display="none"
            for(user of data.nonfriends){
                totalnumber+=1
                all+=`<div class="col-lg-3 col-sm-6 relative" id="`+user._id+`" onclick='genprofile()'>
                            <div class="friend-list-view" id="`+user._id+`" >
                                <!-- profile picture end -->
                                <div class="profile-thumb" id="`+user._id+`">
                                    <a id="`+user._id+`">
                                        <figure class="profile-thumb-middle" id="`+user._id+`">
                                            <img src="assets/images/profile/profile-small-4.jpg" alt="profile picture" id="`+user._id+`">
                                        </figure>
                                    </a>
                                </div>

                                <div class="posted-author" id="`+user._id+`">
                                    <h6 class="author" id="`+user._id+`"><a  id="`+user._id+`">`+user.name+`</a></h6>
                                    <button class="add-frnd" id="`+user._id+`">Not a friend!Tap to see profile</button>
                                </div>
                            </div>
                        </div>`
            }
            for(user of data.friends){
                totalnumber+=1
                all+=`<div class="col-lg-3 col-sm-6 relative" id="`+user._id+`" onclick="genprofile()">
                            <div class="friend-list-view" id="`+user._id+`">
                                <div class="profile-thumb" id="`+user._id+`">
                                    <a id="`+user._id+`">
                                        <figure class="profile-thumb-middle" id="`+user._id+`">
                                            <img src="assets/images/profile/profile-small-4.jpg" alt="profile picture" id="`+user._id+`">
                                        </figure>
                                    </a>
                                </div>
                                <!-- profile picture end -->

                                <div class="posted-author" id="`+user._id+`">
                                    <h6 class="author" id="`+user._id+`"><a id="`+user._id+`">`+user.name+`</a></h6>
                                    <button class="add-frnd" id="`+user._id+`">Tap to message</button>
                                </div>
                            </div>
                        </div>`
            }
            for(user of data.sentrequests){
                totalnumber+=1
                all+=`<div class="col-lg-3 col-sm-6 relative" id="`+user._id+`" onclick="genprofile()">
                            <div class="friend-list-view" id="`+user._id+`" >
                                <!-- profile picture end -->
                                <div class="profile-thumb" id="`+user._id+`">
                                    <a  id="`+user._id+`">
                                        <figure class="profile-thumb-middle" id="`+user._id+`">
                                            <img src="assets/images/profile/profile-small-4.jpg" alt="profile picture" id="`+user._id+`">
                                        </figure>
                                    </a>
                                </div>
                                <!-- profile picture end -->

                                <div class="posted-author" id="`+user._id+`">
                                    <h6 class="author" id="`+user._id+`"><a id="`+user._id+`">`+user.name+`</a></h6>
                                    <button class="add-frnd" id="`+user._id+`">request already sent</button>
                                </div>
                            </div>
                        </div>`
            }
            for(user of data.pendingrequests){
                totalnumber+=1
                all+=`<div class="col-lg-3 col-sm-6 relative" id="`+user._id+`" onclick="genprofile()">
                            <div class="friend-list-view" id="`+user._id+`">
                                <!-- profile picture end -->
                                <div class="profile-thumb" id="`+user._id+`">
                                    <a id="`+user._id+`">
                                        <figure class="profile-thumb-middle" id="`+user._id+`">
                                            <img src="assets/images/profile/profile-small-4.jpg" alt="profile picture" id="`+user._id+`">
                                        </figure>
                                    </a>
                                </div>
                                <!-- profile picture end -->
                                <div class="posted-author" id="`+user._id+`">
                                    <h6 class="author" id="`+user._id+`"><a id="`+user._id+`">`+user.name+`</a></h6>
                                    <button class="add-frnd" id="`+user._id+`">tap here to accept or reject</button>
                                </div>
                            </div>
                        </div>`
            }
            document.getElementById("friendslist").innerHTML=all
            document.getElementById("numberoffriends").innerHTML="All Users("+totalnumber+")"
            $("#friendslist").fadeIn("3000")
            $("#numberoffriends").fadeIn("slow")
            
        }
        
    })
}
function newprofiles(){
    $.ajax({
        url:sb+"getuserprofiledetails",
        type:"GET",
        headers:{
            token:token
        },
        success:function(data){
            all=""
            $("#friendslist").fadeOut("3000")
            totalnumber=0
            document.getElementById("numberoffriends").style.display="none"
            document.getElementById("friendslist").style.display="none"
            for(user of data.nonfriends){
                totalnumber+=1
                all+=`<div class="col-lg-3 col-sm-6 relative" id="`+user._id+`" onclick='genprofile()'>
                            <div class="friend-list-view" id="`+user._id+`" >
                                <!-- profile picture end -->
                                <div class="profile-thumb" id="`+user._id+`">
                                    <a id="`+user._id+`">
                                        <figure class="profile-thumb-middle" id="`+user._id+`">
                                            <img src="assets/images/profile/profile-small-4.jpg" alt="profile picture" id="`+user._id+`">
                                        </figure>
                                    </a>
                                </div>

                                <div class="posted-author" id="`+user._id+`">
                                    <h6 class="author" id="`+user._id+`"><a  id="`+user._id+`">`+user.name+`</a></h6>
                                    <button class="add-frnd" id="`+user._id+`">Not a friend!Tap to see profile</button>
                                </div>
                            </div>
                        </div>`
            }
            document.getElementById("friendslist").innerHTML=all
            $("#friendslist").fadeIn("3000")
            $("#numberoffriends").html("New Profiles("+totalnumber+")")
            $("#numberoffriends").fadeIn("slow")
        }
    })
}
function reqsent(){
    $.ajax({
        url:sb+"getuserprofiledetails",
        type:"GET",
        headers:{
            token:token
        },
        success:function(data){
            all=""
            $("#friendslist").fadeOut("3000")
            totalnumber=0
            document.getElementById("numberoffriends").style.display="none"
            document.getElementById("friendslist").style.display="none"
            for(user of data.sentrequests){
                totalnumber+=1
                all+=`<div class="col-lg-3 col-sm-6 relative" id="`+user._id+`" onclick="genprofile()">
                            <div class="friend-list-view" id="`+user._id+`" >
                                <!-- profile picture end -->
                                <div class="profile-thumb" id="`+user._id+`">
                                    <a  id="`+user._id+`">
                                        <figure class="profile-thumb-middle" id="`+user._id+`">
                                            <img src="assets/images/profile/profile-small-4.jpg" alt="profile picture" id="`+user._id+`">
                                        </figure>
                                    </a>
                                </div>
                                <!-- profile picture end -->

                                <div class="posted-author" id="`+user._id+`">
                                    <h6 class="author" id="`+user._id+`"><a id="`+user._id+`">`+user.name+`</a></h6>
                                    <button class="add-frnd" id="`+user._id+`">request already sent</button>
                                </div>
                            </div>
                        </div>`
            }
            document.getElementById("friendslist").innerHTML=all
            $("#friendslist").fadeIn("3000")
            $("#numberoffriends").html("Sent Requests("+totalnumber+")")
            $("#numberoffriends").fadeIn("slow")
        }
    })
}
function friends(){
    $.ajax({
        url:sb+"getuserprofiledetails",
        type:"GET",
        headers:{
            token:token
        },
        success:function(data){
            all=""
            $("#friendslist").fadeOut("3000")
            totalnumber=0
            document.getElementById("numberoffriends").style.display="none"
            document.getElementById("friendslist").style.display="none"
            for(user of data.friends){
                totalnumber+=1
                all+=`<div class="col-lg-3 col-sm-6 relative" id="`+user._id+`" onclick="genprofile()">
                            <div class="friend-list-view" id="`+user._id+`">
                                <div class="profile-thumb" id="`+user._id+`">
                                    <a id="`+user._id+`">
                                        <figure class="profile-thumb-middle" id="`+user._id+`">
                                            <img src="assets/images/profile/profile-small-4.jpg" alt="profile picture" id="`+user._id+`">
                                        </figure>
                                    </a>
                                </div>
                                <!-- profile picture end -->

                                <div class="posted-author" id="`+user._id+`">
                                    <h6 class="author" id="`+user._id+`"><a id="`+user._id+`">`+user.name+`</a></h6>
                                    <button class="add-frnd" id="`+user._id+`">Tap to message</button>
                                </div>
                            </div>
                        </div>`
            }
            document.getElementById("friendslist").innerHTML=all
            $("#friendslist").fadeIn("3000")
            $("#numberoffriends").html("Friends("+totalnumber+")")
            $("#numberoffriends").fadeIn("slow")
        }
    })
}
function reqpending(){
    $.ajax({
        url:sb+"getuserprofiledetails",
        type:"GET",
        headers:{
            token:token
        },
        success:function(data){
            all=""
            totalnumber=0
            $("#numberoffriends").hide()    
            $("#friendslist").fadeOut("3000")
            document.getElementById("friendslist").style.display="none"
            //user of data.pendingrequests
            for(user of data.pendingrequests){
                totalnumber+=1
                all+=`<div class="col-lg-3 col-sm-6 relative" id="`+user._id+`" onclick="genprofile()">
                            <div class="friend-list-view" id="`+user._id+`">
                                <!-- profile picture end -->
                                <div class="profile-thumb" id="`+user._id+`">
                                    <a id="`+user._id+`">
                                        <figure class="profile-thumb-middle" id="`+user._id+`">
                                            <img src="assets/images/profile/profile-small-4.jpg" alt="profile picture" id="`+user._id+`">
                                        </figure>
                                    </a>
                                </div>
                                <!-- profile picture end -->
                                <div class="posted-author" id="`+user._id+`">
                                    <h6 class="author" id="`+user._id+`"><a id="`+user._id+`">`+user.name+`</a></h6>
                                    <button class="add-frnd" id="`+user._id+`">tap here to accept or reject</button>
                                </div>
                            </div>
                        </div>`
            }
            document.getElementById("friendslist").innerHTML=all
            $("#friendslist").fadeIn("3000")
            $("#numberoffriends").html("Pending Requests("+totalnumber+")")
            $("#numberoffriends").fadeIn("slow")
        }
    })
}
if(window.location.href.indexOf("friends.html")>=0){
    $(document).ready(function(){
        readystate()
        $.ajax({
            url:sb+"getuserprofiledetails",
            type:"GET",
            headers:{
                token:token
            },
            success:function(data){
                document.getElementById("cpdisplay").innerHTML+=` <div class="profile-banner-large bg-img" name="coverpic" >
                <img style="width:1920px;height:350px" src="`+data.profile.coverpic+`">
                </div>
               
                `
                document.getElementById("ppdisplay").innerHTML+=`
                <div class="profile-picture-box"  >
                <figure class="profile-picture">
                    <a href="profile.html" >
                        <img style="width:270px;height:270px" src="`+data.profile.profilepic+`"  alt="profile picture"> 
                    </a>
                </figure>
            </div>`
                $("#maindiv").fadeIn("slow")
                all=""
                totalnumber=0
                for(user of data.nonfriends){
                    totalnumber+=1
                    all+=`<div class="col-lg-3 col-sm-6 relative" id="`+user._id+`" onclick='genprofile()'>
                                <div class="friend-list-view" id="`+user._id+`" >
                                    <!-- profile picture end -->
                                    <div class="profile-thumb" id="`+user._id+`">
                                        <a id="`+user._id+`">
                                            <figure class="profile-thumb-middle" id="`+user._id+`">
                                                <img src="assets/images/profile/profile-small-4.jpg" alt="profile picture" id="`+user._id+`">
                                            </figure>
                                        </a>
                                    </div>

                                    <div class="posted-author" id="`+user._id+`">
                                        <h6 class="author" id="`+user._id+`"><a  id="`+user._id+`">`+user.name+`</a></h6>
                                        <button class="add-frnd" id="`+user._id+`">Not a friend!Tap to see profile</button>
                                    </div>
                                </div>
                            </div>`
                }
                for(user of data.friends){
                    totalnumber+=1
                    all+=`<div class="col-lg-3 col-sm-6 relative" id="`+user._id+`" onclick="genprofile()">
                                <div class="friend-list-view" id="`+user._id+`">
                                    <div class="profile-thumb" id="`+user._id+`">
                                        <a id="`+user._id+`">
                                            <figure class="profile-thumb-middle" id="`+user._id+`">
                                                <img src="assets/images/profile/profile-small-4.jpg" alt="profile picture" id="`+user._id+`">
                                            </figure>
                                        </a>
                                    </div>
                                    <!-- profile picture end -->

                                    <div class="posted-author" id="`+user._id+`">
                                        <h6 class="author" id="`+user._id+`"><a id="`+user._id+`">`+user.name+`</a></h6>
                                        <button class="add-frnd" id="`+user._id+`">Tap to message</button>
                                    </div>
                                </div>
                            </div>`
                }
                for(user of data.sentrequests){
                    totalnumber+=1
                    all+=`<div class="col-lg-3 col-sm-6 relative" id="`+user._id+`" onclick="genprofile()">
                                <div class="friend-list-view" id="`+user._id+`" >
                                    <!-- profile picture end -->
                                    <div class="profile-thumb" id="`+user._id+`">
                                        <a  id="`+user._id+`">
                                            <figure class="profile-thumb-middle" id="`+user._id+`">
                                                <img src="assets/images/profile/profile-small-4.jpg" alt="profile picture" id="`+user._id+`">
                                            </figure>
                                        </a>
                                    </div>
                                    <!-- profile picture end -->

                                    <div class="posted-author" id="`+user._id+`">
                                        <h6 class="author" id="`+user._id+`"><a id="`+user._id+`">`+user.name+`</a></h6>
                                        <button class="add-frnd" id="`+user._id+`">request already sent</button>
                                    </div>
                                </div>
                            </div>`
                }
                for(user of data.pendingrequests){
                    totalnumber+=1
                    all+=`<div class="col-lg-3 col-sm-6 relative" id="`+user._id+`" onclick="genprofile()">
                                <div class="friend-list-view" id="`+user._id+`">
                                    <!-- profile picture end -->
                                    <div class="profile-thumb" id="`+user._id+`">
                                        <a id="`+user._id+`">
                                            <figure class="profile-thumb-middle" id="`+user._id+`">
                                                <img src="assets/images/profile/profile-small-4.jpg" alt="profile picture" id="`+user._id+`">
                                            </figure>
                                        </a>
                                    </div>
                                    <!-- profile picture end -->
                                    <div class="posted-author" id="`+user._id+`">
                                        <h6 class="author" id="`+user._id+`"><a id="`+user._id+`">`+user.name+`</a></h6>
                                        <button class="add-frnd" id="`+user._id+`">tap here to accept or reject</button>
                                    </div>
                                </div>
                            </div>`
                }
                document.getElementById("friendslist").innerHTML=all
                $("#numberoffriends").html("All Users("+totalnumber+")")
            }
            
        })
    })
}
if(window.location.href.indexOf("photos.html")>=0){
    $(document).ready(function(){
        readystate()
        $.ajax({
            url:sb+"photos",
            type:"GET",
            headers:{
                token:token
            },
            success:function(data){
                $("#maindiv").fadeIn("slow")
                document.getElementById("cpdisplay").innerHTML+=` <div class="profile-banner-large bg-img" name="coverpic" >
                <img style="width:1920px;height:350px" src="`+data.profile.coverpic+`">
                </div>
               
                `
                document.getElementById("ppdisplay").innerHTML+=`
                <div class="profile-picture-box"  >
                <figure class="profile-picture">
                    <a href="profile.html" >
                        <img style="width:270px;height:270px" src="`+data.profile.profilepic+`"  alt="profile picture"> 
                    </a>
                </figure>
            </div>`
            document.getElementById("postscount").innerHTML=`POSTS(`+data.posts.length+")"
                for(i of data.posts){
                    param=i._id+":"+i.posttext
                    document.getElementById("myposts").innerHTML+=`<div class="card ">
                    <!-- post title start -->
                    <div class="post-title d-flex align-items-center">
                        <!-- profile picture end -->
                        <div class="profile-thumb">
                            <a href="#">
                                <figure class="profile-thumb-middle">
                                    <img src="`+data.profile.profilepic+`" alt="profile picture">
                                </figure>
                            </a>
                        </div>
                        <!-- profile picture end -->
  
                        <div class="posted-author">
                            <h6 class="author"><a href="profile.html">`+i.postedby+`</a></h6>
                            <span class="post-time">`+i.time.substr(3,18)+`</span>
                        </div>
                    </div>
                    <!-- post title start -->
                    <div class="post-content">
                        <p class="post-desc">
                            `+i.posttext+`
                        </p>
                        <div class="post-thumb-gallery">
                            <figure class="post-thumb img-popup">
                                <a href="`+i.image+`">
                                    <img src="`+i.image+`" alt="post image">
                                </a>
                            </figure>
                        </div>
                        <div class="post-meta">
                                <img class="" id="`+i._id+`0"  name="0" src="assets/images/icons/heart.png" alt=""  >
                                <p style="padding-left: 3px;" id="`+i._id+`hiii"> people liked</p>
                            <ul class="comment-share-meta">
                                <li>
                                    <button class="post-comment" onclick='comment("`+i._id+`")'>
                                        <i class="bi bi-chat-bubble"></i>
                                        <span id="`+i._id+`numberofcomments">41</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div id="`+i._id+`newdiv" style="display:none">
                                <br>
                                <div>
                                    <ul id="`+i._id+`comments" style="border:1px solid rgb(142, 131, 131);border-radius: 10px;"><br>
                                    </ul>
                                </div>
                            </div>
                    </div>
                </div>`
                document.getElementById(i._id+"numberofcomments").innerHTML=i.comments.length
                for(kom of i.comments){
                    document.getElementById(i._id+"comments").innerHTML=`<li class="unorder-list">
                    <div class="profile-thumb">
                        <a>
                            <figure class="profile-thumb-small">
                                <img src="`+kom.profilepic+`" alt="profile picture">
                            </figure>
                        </a>
                    </div>
                    <div class="unorder-list-info">
                        <h3 class="list-title"><a>`+kom.name+`</a></h3>
                        <p class="list-subtitle"><a href="#">`+kom.commentmessage+`</a></p>
                    </div>
                    <p class="like-button" style="font-size:medium">
                    `+kom.time.substr(3,18)+`
                    </p>
                </li>
                <br>`+document.getElementById(i._id+"comments").innerHTML
                }
                if(data.profile.likedposts.includes(i._id)){
                    document.getElementById(i._id+"0").src="assets/images/icons/heart-color.png"
                    document.getElementById(i._id+"hiii").innerHTML="you and "+i.likedby.length+" people liked the post"
                }
                else{
                    document.getElementById(i._id+"0").src="assets/images/icons/heart.png"
                    document.getElementById(i._id+"hiii").innerHTML=i.likedby.length+" people liked the post"
                }
                    
                }
            }
        })
    })
}
function savechanges(){
    $.ajax({
        url:sb+"posteditprofile",
        type:"POST",
        headers:{
            token:token
        },
        contentType:"application/json",
        data:JSON.stringify({
            location:$("#userlocation").val(),
            hobbiesarr:[$("#hobbies1").val(),$("#hobbies2").val(),$("#hobbies3").val()],
            somethingaboutme:$("#somethingaboutme").val(),
            education:$("#education").val()
        }),
        success:function(data){
            window.location.href="profile.html"
        }
    })
}


function editprofile(){
    $("#classform").fadeIn("slow")
    $("#savechanges").fadeIn("slow")
    document.getElementById("userlocation").disabled=false
    document.getElementById("hobbies1").disabled=false
    document.getElementById("hobbies2").disabled=false
    document.getElementById("hobbies3").disabled=false
    document.getElementById("somethingaboutme").disabled=false
    document.getElementById("education").disabled=false
}



$(document).ready(()=>{
    $("#datap").submit(function(){
        event.preventDefault()      
        document.getElementById("psubmit").disabled=true
        var data=new FormData($("#datap")[0])
        $.ajax({
            url:sb+"postupdatepropicture",
            type:'POST',
            headers:{
                token:token
            },
            contentType:false,
            processData:false,
            enctype:"multipart/form-data",
            cache:false,
            headers:{token:token},
            data : data,
            success:function(data){
                window.location.href="profile.html"
            }
        })
       
    })
    
})

$(document).ready(()=>{
    $("#datac").submit(function(){
        event.preventDefault()
        document.getElementById("csubmit").disabled=true
        var data=new FormData($("#datac")[0])
        $.ajax({
            url:sb+"postupdatecoverpicture",
            type:'POST',
            headers:{
                token:token
            },
            contentType:false,
            processData:false,
            enctype:"multipart/form-data",
            cache:false,
            headers:{token:token},
            data : data,
            success:function(data){
                window.location.href="profile.html"
            }
        })
    
      
    })
    
})

if(window.location.href.indexOf("/profile.html")>=0){
    $(document).ready(function(){
        readystate()
        $.ajax({
            url:sb+"getprofile",
            type:"GET",
            headers:{
                token:token
            },
            success:function(data){
                $("#username").html(data.name)
                $("#bodypart").fadeIn("slow")
                document.getElementById("cpdisplay").innerHTML+=` <div class="profile-banner-large bg-img" name="coverpic" >
                <img style="width:1920px;height:350px" src="`+data.coverpic+`">
                </div>
               
                `
                document.getElementById("ppdisplay").innerHTML+=`
                <div class="profile-picture-box"  >
                <figure class="profile-picture">
                    <a href="profile.html" >
                        <img style="width:270px;height:270px" src="`+data.profilepic+`"  alt="profile picture"> 
                    </a>
                </figure>
            </div>`
                $("#hobbies1").val(data.hobbies[0])
                $("#hobbies2").val(data.hobbies[1])
                $("#hobbies3").val(data.hobbies[2])
                $("#userlocation").val(data.location)
                $("#somethingaboutme").html(data.somethingaboutme)
                $("#education").html(data.education)
            }
        })
    })
}
function search(){
    var text=document.getElementById("searchtext").value
}

socket.on("acceptedpost",(data)=>{
    document.getElementById("addnewnotifications").innerHTML=`<li class="msg-list-item d-flex justify-content-between">
                                                                <div class="msg-content notification-content" style="width:80%">
                                                                    <a>`+data+`</a>
                                                                    <a></a>
                                                                </div>
                                                                <div class="msg-time">
                                                                    <p>`+new Date().toString().substr(0,24)+`</p>
                                                                </div>
                                                            </li>`+document.getElementById("addnewnotifications").innerHTML
    document.getElementById("notifications").click()
    var timer2=setTimeout(()=>{
        document.getElementById("notifications").click()
    },3000)
})

if(window.location.href.indexOf("childmorally.html")>=0){
    $(document).ready(function(){
        readystate()
        $("#maindiv").fadeIn("slow")
        $.ajax({
            url:sb+"childmorally",
            type:"GET",
            headers:{
                token:token
            },
            success:function(data){
                categories={}
                var str=""
                for(i of data){
                    if(i.category in categories){
                        categories[i.category].push(i)
                    }
                    else{
                        categories[i.category]=[i]
                    }
                }
                j=0
                for(i in categories){
                    str+=`
                        <div class="col-3  card text-white mb-3" style="width:20rem; border-radius: 10px; margin-right:20px;margin-left:40px; background-color:rgb(188, 66, 32)">
                        <img src=${arr[j]} style="height:250px;width:300px" class="card-img-top" alt="...">
              
                      
                        <div class="card-body">
                        <h5 class="card-title">`+i+`</h5>
                        <p class="card-text">Indulge into your favourite `+i+` posts</p>
                            <button class="btn" onclick='catdis(`+JSON.stringify(categories[i])+`)' id=`+i+`><a href="#posts">See All</a></button>
                        </div>
                    </div>`
                j=j+1
                }
                document.getElementById("categoryposts").innerHTML+=str    
                
            }
        })
    })
}



////////////////////////////////parent calls/////////////////////////////////////

function preadystate(){
    $.ajax({
        url:sb+"p-index",
        type:"GET",
        headers:{
            token:token
        },
        error:function(err,data){
            if(err.status==401 || 404){
                window.location.href=err.responseText
            }
        },
        success:function(data){
            $("#currname").html(data.name)
            $("#curremail").html(data.parentemail)
            $("#headersp").fadeIn("slow")
            socket.emit("adduserp",data)
        }

    })
}
if(window.location.href.indexOf("p-index.html")>=0){
    $(document).ready(function(){
        preadystate()
        $("#maindiv").fadeIn("slow")
        $.ajax({
            url:sb+"getp-index",
            type:"GET",
            headers:{
                token:token
            },
            
            success:function(data){
                childobj=data.obj
                datas=data.posts
                for(data of datas){
                    document.getElementById("postsblock").innerHTML+=`<div class="card" name="`+data._id+`">
        <!-- post title start -->
        <div class="post-title d-flex align-items-center">
            <!-- profile picture end -->
            <div class="profile-thumb">
                <a href="#">
                    <figure class="profile-thumb-middle">
                        <img src="`+childobj.profilepic+`" alt="profile picture">
                    </figure>
                </a>
            </div>
            <!-- profile picture end -->

            <div class="posted-author">
                <h6 class="author"><a href="profile.html">`+data.postedby+`</a></h6>
                <span class="post-time">`+data.time.substr(3,18)+`</span>
            </div>

        
        </div>
        <!-- post title start -->
        <div class="post-content">
            <p class="post-desc">
            `+data.posttext+`
            </p>
        
            <div class="post-thumb-gallery">
                <figure class="post-thumb img-popup">
                    <a href="`+data.image+`">
                        <img src="`+data.image+`" alt="post image">
                    </a>
                </figure>
            </div>
        </div>
        <br>
        <div class="container">
            <button id="`+data._id+`" style="padding: 5px; margin-right: 10px; background-color: rgb(93, 154, 49); border-radius: 10px;" onclick="acceptpost()"> Accept</button>
            <button id="`+data._id+`" style="padding: 5px; margin-left: 10px;background-color: rgb(211, 74, 47); border-radius: 10px;" onclick="rejectpost()">Reject</button>
        </div>

    </div>`
                }

            }
        })
    })
}

function acceptpost(){
    socket.emit("acceptpost",[token,event.target.id])
    document.getElementsByName(event.target.id)[0].remove()
}
function rejectpost(){
    socket.emit("rejectpost",[token,event.target.id])
    document.getElementsByName(event.target.id)[0].remove()
}
if(window.location.href.indexOf("/p-genprofile.html")>=0){
    $(document).ready(function(){
        preadystate()
        
        $.ajax({
            url:sb+"getchildprofile",
            type:"GET",
            headers:{
                token:token
            },
            
            success:function(data){
                $("#maindiv").fadeIn("slow")
                $("#username").html(data.name)
                $("#bodypart").fadeIn("slow")
                document.getElementById("cpdisplay").innerHTML+=` <div class="profile-banner-large bg-img" name="coverpic">
                <img style="width:1920px;height:350px" src="`+data.coverpic+`">
                </div>
               
                `
                document.getElementById("ppdisplay").innerHTML+=`
                <div class="profile-picture-box"  >
                <figure class="profile-picture">
                    <a href="profile.html" >
                        <img style="width:270px;height:270px" src="`+data.profilepic+`"  alt="profile picture"> 
                    </a>
                </figure>
            </div>`
                $("#hobbies1").val(data.hobbies[0])
                $("#hobbies2").val(data.hobbies[1])
                $("#hobbies3").val(data.hobbies[2])
                $("#userlocation").val(data.location)
                $("#somethingaboutme").html(data.somethingaboutme)
                $("#education").html(data.education)
            }
        })
    })
}

function catdis(data){
    all=""
    $("#posts").fadeIn("slow")
    $("#catdisplay").fadeOut("slow")
    if(window.location.href.indexOf("childmorally.html")>=0){
        $.ajax({
            url:sb+"getprofile",
            headers:{
                token:token
            },
            success:function(copy){
                for(i of data){
                    var len=(i.likedby.length).toString()
                    all+=` <div class="card ">
                    <div class="post-title d-flex align-items-center">
                    <!-- profile picture end -->
                    <div class="profile-thumb">
                    <a href="#">
                    <figure class="profile-thumb-middle">
                    <img src="assets/images/profile/profile-small-1.jpg" alt="profile picture">
                    </figure>
                    </a>
                    </div>
                    <div class="posted-author">
                    <h6 class="author">`+i.postedby+`</h6>
                    <span class="post-time">`+i.time.substr(4,17)+`</span>
                    </div>
                    </div>
                    <!-- post title start -->
                    <div class="post-content">
                    <p class="post-desc d-flex" id="posttext" >
                    <input class="form-control bg-white" id="inputbox" disabled style="border:none" value="`+i.posttext+`">
                    <button class="bg-secondary" id="savebutton" type="button" style="border:0px solid black;border-radius:30px;width:70px;display:none" onclick='updatepost("`+i._id+`")'>save</button>
                    </p>
                    <div class="post-thumb-gallery">
                    <figure class="post-thumb img-popup">
                    <a href="assets/images/post/post-1.jpg">
                    <img src="`+i.image+`">
                    </a>
                    </figure>
                    </div>
                    <div class="post-meta">
                    <button class="like-button d-flex" >
                    <img class="" id="`+i._id+`0" name="0" src="assets/images/icons/heart.png" alt="" onclick='liked("`+i._id+":"+len+`")'>
                    <p style="padding-left: 3px;" id="`+i._id+`hiii"> people liked</p>
                    </button>
                    </div>
                    </div>
                    </div><br><br>`                    
                    }
                    document.getElementById("catdisplay").innerHTML=all
                    for(i of data){
                        if(copy.likedposts.includes(i._id)){
                            document.getElementById(i._id+"0").src="assets/images/icons/heart-color.png"
                            document.getElementById(i._id+"hiii").innerHTML="you and "+i.likedby.length+" people liked the post"
                        }
                        else{
                            document.getElementById(i._id+"0").src="assets/images/icons/heart.png"
                            document.getElementById(i._id+"hiii").innerHTML=i.likedby.length+" people liked the post"
                        }
                    }
                    $("#catdisplay").fadeIn("slow")
                    
            }
        })
    }
    else{
        $.ajax({
            url:sb+"getpprofile",
            headers:{
                token:token
            },
            success:function(copy){
                for(i of data){
                    var len=(i.likedby.length).toString()
                    all+=` <div class="card ">
                    <div class="post-title d-flex align-items-center">
                    <!-- profile picture end -->
                    <div class="profile-thumb">
                    <a href="#">
                    <figure class="profile-thumb-middle">
                    <img src="assets/images/profile/profile-small-1.jpg" alt="profile picture">
                    </figure>
                    </a>
                    </div>
                    <div class="posted-author">
                    <h6 class="author">`+i.postedby+`</h6>
                    <span class="post-time">`+i.time.substr(4,17)+`</span>
                    </div>
                    </div>
                    <!-- post title start -->
                    <div class="post-content">
                    <p class="post-desc d-flex" id="posttext" >
                    <input class="form-control bg-white" id="inputbox" disabled style="border:none" value="`+i.posttext+`">
                    <button class="bg-secondary" id="savebutton" type="button" style="border:0px solid black;border-radius:30px;width:70px;display:none" onclick='updatepost("`+i._id+`")'>save</button>
                    </p>
                    <div class="post-thumb-gallery">
                    <figure class="post-thumb img-popup">
                    <a href="assets/images/post/post-1.jpg">
                    <img src="`+i.image+`">
                    </a>
                    </figure>
                    </div>
                    <div class="post-meta">
                    <button class="like-button d-flex" >
                    <img class="" id="`+i._id+`0" name="0" src="assets/images/icons/heart.png" alt="" onclick='liked("`+i._id+":"+len+`")'>
                    <p style="padding-left: 3px;" id="`+i._id+`hiii"> people liked</p>
                    </button>
                    </div>
                    </div>
                    </div><br><br>`
                    }
                    document.getElementById("catdisplay").innerHTML=all
                    for(i of data){
                        if(copy.likedposts.includes(i._id)){
                            document.getElementById(i._id+"0").src="assets/images/icons/heart-color.png"
                            document.getElementById(i._id+"hiii").innerHTML="you and "+i.likedby.length+" people liked the post"
                        }
                        else{
                            document.getElementById(i._id+"0").src="assets/images/icons/heart.png"
                            document.getElementById(i._id+"hiii").innerHTML=i.likedby.length+" people liked the post"
                        }
                    }
                    $("#catdisplay").fadeIn("slow")
                    
            }
        })
    }
}
function myactivity(){
    window.location.href="catcontent.html"
}



if(window.location.href.indexOf("categories.html")>=0){
    $(document).ready(function(){
        preadystate()
        $("#maindiv").fadeIn("slow")
        $.ajax({
            url:sb+"getcategory",
            type:"GET",
            headers:{
                token:token
            },
            error:function(err,data){
                if(err.status==401 || 404){
                    window.location.href=err.responseText
                }
            },
            success:function(data){
                categories={}
                var str=""
                for(i of data){
                    if(i.category in categories){
                        categories[i.category].push(i)
                    }
                    else{
                        categories[i.category]=[i]
                    }
                }
                j=0
                for(i in categories){
                    str+=`
                        <div class="col-3  card text-white mb-3" style="width:20rem; border-radius: 10px; margin-right:20px;margin-left:40px; background-color:rgb(188, 66, 32)">
                        <img src=${arr[j]} style="height:250px;width:300px" class="card-img-top" alt="...">
              
                      
                        <div class="card-body">
                        <h5 class="card-title">`+i+`</h5>
                        <p class="card-text">Indulge into your favourite `+i+` posts</p>
                            <button class="btn " onclick='catdis(`+JSON.stringify(categories[i])+`)' id=`+i+`><a href="#posts">See All</a></button>
                        </div>
                    </div>`
                j+=1
                }
                document.getElementById("categoryposts").innerHTML+=str                
            }
        })
    })
}
socket.on("newposts",(data)=>{
    copy=data
    data=data[0]
    childobj=copy[1]
    
    if(window.location.href.indexOf("p-index.html")>=0){
        document.getElementById("postsblock").innerHTML=`<div class="card " name="`+data._id+`">
        <!-- post title start -->
        <div class="post-title d-flex align-items-center">
            <!-- profile picture end -->
            <div class="profile-thumb">
                <a href="#">
                    <figure class="profile-thumb-middle">
                        <img src="`+childobj.profilepic+`" alt="profile picture">
                    </figure>
                </a>
            </div>
            <!-- profile picture end -->

            <div class="posted-author">
                <h6 class="author"><a href="profile.html">`+data.postedby+`</a></h6>
                <span class="post-time">`+data.time.substr(3,18)+`</span>
            </div>

        
        </div>
        <!-- post title start -->
        <div class="post-content">
            <p class="post-desc">
            `+data.posttext+`
            </p>
        
            <div class="post-thumb-gallery">
                <figure class="post-thumb img-popup">
                    <a href="`+data.image+`">
                        <img src="`+data.image+`" alt="post image">
                    </a>
                </figure>
            </div>
        </div>
        <br>
        <div class="container">
            <button id="`+data._id+`" style="padding: 5px; margin-right: 10px; background-color: rgb(93, 154, 49); border-radius: 10px;" onclick="acceptpost()"> Accept</button>
            <button id="`+data._id+`" style="padding: 5px; margin-left: 10px;background-color: rgb(211, 74, 47); border-radius: 10px;" onclick="rejectpost()">Reject</button>
        </div>

    </div>`+document.getElementById("postsblock").innerHTML
    }
    document.getElementById("addnewnotifications").innerHTML=`<li class="msg-list-item d-flex justify-content-between">
                                                                <div class="msg-content notification-content" style="width:80%">
                                                                    <a>your child has a new post </a>
                                                                    <a></a>
                                                                </div>
                                                                <div class="msg-time">
                                                                    <p>`+new Date().toString().substr(0,24)+`</p>
                                                                </div>
                                                            </li>`+document.getElementById("addnewnotifications").innerHTML
    document.getElementById("notifications").click()
    var timer2=setTimeout(()=>{
        document.getElementById("notifications").click()
    },3000)
})
$(document).ready(()=>{
    $("#formdata1").submit(function(){
        event.preventDefault()
        var data=new FormData($("#formdata1")[0])
        $.ajax({
            url:sb+"postchildposts",
            type:'POST',
            headers:{
                token:token
            },
            contentType: false,
            processData:false,
            enctype:"multipart/form-data",
            cache:false,
            headers:{token:token},
            data : data,
            success:function(k){

                socket.emit("newpost",[token,k])
            }
        })
    })
})
$(document).ready(()=>{
    $("#formdata").submit(function(){
        var data=new FormData($("#formdata")[0])
        $.ajax({
            url:sb+"postparentPosts",
            type:'POST',
            headers:{
                token:token
            },
            contentType: false,
            processData:false,
            enctype:"multipart/form-data",
            cache:false,
            headers:{token:token},
            data : data,
            success:function(data){
                alert('post added successfully')
            }
        })
    })
})
function updatepost(postid){
    $.ajax({
        url:sb+"postupdatepost",
        type:"POST",
        contentType:"application/json",
        headers:{token:token},
        data:JSON.stringify({
            posttext:document.getElementById(postid+"inputbox").value,
            postid:postid
            
        }),
        success:(data)=>{
            if (data==="successfully updated"){
                document.getElementById(postid+"inputbox").disabled=true
                document.getElementById(postid+"inputbox").style.border="0px solid black"
                document.getElementById(id+"savebutton").style.display="none"
            }
      
        }
    })


}


function editposttext(copy){
    console.log(copy)
    copy=copy.split(":")
    text=copy[1]
    id=copy[0]
    document.getElementById(id+"inputbox").disabled=false
    document.getElementById(id+"inputbox").style.border="1px solid black"
    document.getElementById(id+"savebutton").style.display="block"
}
if(window.location.href.indexOf("catcontent.html")>=0){
    $(document).ready(function(){
        preadystate()
        $("#maindiv").fadeIn("slow")
        $.ajax({
            url:sb+"getparentposts",
            type:"GET",
            headers:{
                token:token
            },
            error:function(err,data){ 
                if(err.status==401 || 404){
                    window.location.href=err.responseText
                }
            },
            success:function(data){
                all=""
                for(i of data){
                    param=i._id+":"+i.posttext
                    console.log(param)
                    all+=`<div class="card">
                    <div class="post-title d-flex align-items-center">
                        <!-- profile picture end -->
                        <div class="profile-thumb">
                            <a href="#">
                                <figure class="profile-thumb-middle">
                                    <img src="assets/images/profile/profile-small-1.jpg" alt="profile picture">
                                </figure>
                            </a>
                        </div>
                        <div class="posted-author">
                            <h6 class="author">`+i.postedby+`</h6>
                            <span class="post-time">`+i.time.substr(4,17)+`</span>
                        </div>
                        <div class="post-settings-bar">
                            <span></span>
                            <span></span>
                            <span></span>
                            <div class="post-settings arrow-shape">
                                <ul>
                        
                                    <li><button id="editbtn" onclick='editposttext("`+param+`")'>edit post</button></li>
                                    <li><button>embed adda</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!-- post title start -->
                    <div class="post-content">
                        <p class="post-desc d-flex" id="posttext" >
                            <input class="form-control bg-white" id="`+i._id+`inputbox" disabled style="border:none" value="`+i.posttext+`">
                            <button class="bg-secondary" id="`+i._id+`savebutton" type="button" style="border:0px solid black;border-radius:30px;width:70px;display:none" onclick='updatepost("`+i._id+`")'>save</button>
                        </p>
                        <div class="post-thumb-gallery">
                            <figure class="post-thumb img-popup">
                                <a href="assets/images/post/post-1.jpg">
                                    <img src="`+i.image+`">
                                </a>
                            </figure>
                        </div>
                    </div>
                </div>`
                }
                document.getElementById("catdisplay").innerHTML=all
                
            }
        })
    })
}




