/////models from backend showld be same ass models from sokckets




const mongoose=require("mongoose")
mongoose.connect("mongodb+srv://ppadalavinaybhushan:vinaybhushan@cluster0.628nad6.mongodb.net/vns").then((data)=>{
    console.log("database connected")
})
const users=require("./models/user")
const conversations=require("./models/conversation")
const messages=require("./models/messages")
const parenttable=require("./models/parent")
const userposts=require("./models/userposts")
const parentposts=require("./models/parentposts")
const jwt = require("jsonwebtoken")
const user = require("./models/user")
const dotenv=require("dotenv").config()
var io = require('socket.io')(8900,{
    cors:{
       origin:"*"
    }
 });
function getuser(socket,token){
    jwt.verify(token,process.env.CHILDSECRET,async(err,decoded)=>{
        if(err){
            console.log(err,12345678)
        }
        socket.params=decoded.obj
    })
}
function getpuser(socket,token){
    jwt.verify(token,process.env.PARENTSECRET,async(err,decoded)=>{
        if(err){
            console.log(err,12345678)
        }
        socket.params=decoded.obj
    })
}
io.on('connection',async function(socket){
    console.log('A user connected');
    //Whenever someone disconnects this piece of code executedrs
    socket.on('disconnect',async function () {
       await users.updateOne({socketid:socket.id},{$set:{status:"offline",socketid:"",lastactivetime:new Date().toString()}})
       await parenttable.updateOne({socketid:socket.id},{$set:{status:"offline",socketid:"",lastactivetime:new Date().toString()}})
        io.emit("user","")
    });
    socket.on("adduser",async (token)=>{
       getuser(socket,token)
       var user=(socket.params)
       await users.updateOne({_id:user._id},{$set:{status:"online",
                                                    socketid:socket.id}})
        ans=await users.find({})
        io.emit("user","")
    })
    socket.on("acceptpost",async(data)=>{
        token=data[0]
        id=data[1]
         await userposts.updateOne({_id:id},{$set:{status:"accepted"}})
        getpuser(socket,token)
        var childobj=await users.findOne({email:socket.params.email})
        await users.updateOne({_id:childobj._id},{$push:{notifications:{notificationmessage:"your parent has accepted your new post",
                                                                            time:new Date().toString()}}})
        io.to(childobj.socketid).emit("acceptedpost","your parent has accepted your new post")
    })
    socket.on("rejectpost",async(data)=>{
        console.log(data)
        await userposts.updateOne({_id:data},{$set:{status:"rejected"}})
    })
    socket.on("newpost",async(data)=>{
        getuser(socket,data[0])
        parentobj=await parenttable.findOne({parentemail:socket.params.parentemail})
        io.to(parentobj.socketid).emit("newposts",[data[1],socket.params])
    })
    socket.on("adduserp",async(data)=>{
        console.log(data)
        await parenttable.updateOne({_id:data._id},{$set:{status:'online',socketid:socket.id}})
    })
    socket.on("sendrequest",async (data)=>{
        getuser(socket,data[0]) 
        oppositeid=data[1]
        var oppositeobj=await users.findById(oppositeid)
        await users.updateOne({_id:oppositeid},{$push:{requests:{oppositeid:socket.params._id,time:new Date().toString()}}})
        await users.updateOne({_id:oppositeid},{$push:{notifications:{notificationmessage:socket.params.name+"sent you friend request",time:new Date().toString()}}})
        await users.updateOne({_id:socket.params._id},{$push:{sentrequests:{oppositeid:oppositeid,time:new Date().toString()}}})
        io.to(oppositeobj.socketid).emit("requestsent",socket.params)
    })
    socket.on("acceptrequest",async(data)=>{
        getuser(socket,data[0])
        oppositeid=data[1]
        var oppositeobj=await users.findById(oppositeid)
        await users.updateOne({_id:socket.params._id},{$pull:{requests:{oppositeid:oppositeid}}})
        await users.updateOne({_id:socket.params._id},{$push:{friends:oppositeid}})
        await users.updateOne({_id:oppositeid},{$push:{friends:socket.params._id}})
        await users.updateOne({_id:oppositeid},{$pull:{sentrequests:{oppositeid:socket.params._id}}})
        await conversations.create({members:[socket.params._id,oppositeid]})
        await users.updateOne({_id:oppositeid},{$push:{notifications:{notificationmessage:socket.params.name+"has accepted your friedn request",time:new Date().toString()}}})
        io.to(oppositeobj.socketid).emit("requestaccepted",socket.params)
    })
    /*socket.on("getactiveusers",async(token)=>{
        getuser(socket,token)
        friendslist=socket.params.friends
        console.log((friendslist))
        var ans=await users.find({_id:{$in:friendslist}})
        io.to(socket.id).emit("activeusers",ans)
    })*/
    socket.on("sendmessage",async(data)=>{
        getuser(socket,data[0])
        oppositeid=data[1]
        var oppositeobj=await users.findById(oppositeid)
        var conversationid=await conversations.findOne({members:{$all:[socket.params._id,oppositeid]}})
        conversationid=conversationid._id.toString()
        var messagelist=await messages.findOne({conversationid:conversationid})
        if(!messagelist){
            await messages.create({conversationid:conversationid,messages:[{senderid:socket.params._id,
                                                                                    message:data[2],
                                                                                time:new Date().toString()}]})
        }
        else{
            console.log("insider")
            await messages.updateOne({conversationid:conversationid},{$push:{messages:{senderid:socket.params._id,message:data[2],time:new Date().toString()}}})
        }
        ans={}
        ans.oppositeid=socket.params._id
        ans.name=socket.params.name
        ans.profilepic=socket.params.profilepic
        ans.time=new Date().toString().substr(0,24)
        io.to(oppositeobj.socketid).emit("getmessage",[data[2],ans])
    })
    socket.on("callrequest",async(data)=>{
        getuser(socket,data[0])
        //console.log(data[3],"asfd;lkj",data[4])
        oppositeid=data[1]
        var oppositeobj=await users.findById(oppositeid)
        io.to(oppositeobj.socketid).emit("callrequests",[socket.params,data[2],data[3]])
    })
    socket.on("oppositevideosend",(data)=>{
        console.log(data)
    })
    socket.on("anserd-call",async(data)=>{
        await getuser(socket,data.token)
        var oppositeobj=await users.findById(data.oppositeid)
        console.log(oppositeobj)
        io.to(oppositeobj.socketid).emit("call-accepted",[socket.params.name,data.anser])
    })
    socket.on("disconnectcall",async(data)=>{
        getuser(socket,data[0])
        oppositeobj=await users.findById(data[1])
        io.to(oppositeobj.socketid).emit("disconnectcalls","")
    })
    socket.on("negcallrequest",async(data)=>{
        getuser(socket,data[0])
        oppositeid=data[1]
        offer=data[2]
        oppositeobj=await users.findOne({_id:oppositeid})
        io.to(oppositeobj.socketid).emit("negcallrequests",offer)
    })
    socket.on("neganser",async(data)=>{
        getuser(socket,data[0])
        oppositeid=data[1]
        anser=data[2]
        oppositeobj=await users.findOne({_id:oppositeid})
        io.to(oppositeobj.socketid).emit("negansers",anser)
    })





    socket.on("like",async(copy)=>{
        console.log(copy)
        data=copy[0]
        state=copy[1]
        console.log(data)
        var post=await userposts.findOne({_id:data})
        console.log(post)
        socket.params=await users.findOne({socketid:socket.id})
        if(!socket.params){
            socket.params=await parenttable.findOne({socketid:socket.id})
        }
        if(post){
            var oppositeobj=await users.findOne({_id:post.postedbyid})
            if(state=="1"){
                await users.updateOne({_id:oppositeobj._id},{$push:{notifications:{notificationmessage:socket.params.name+" has liked your post just now",
                                                                                time:new Date().toString()}}})
                io.to(oppositeobj.socketid).emit("liked",[socket.params.name,"liked"])

            }
            else{
                await users.updateOne({_id:oppositeobj._id},{$push:{notifications:{notificationmessage:socket.params.name+" has unliked your post just now",
                                                                                time:new Date().toString()}}})
                io.to(oppositeobj.socketid).emit("liked",[socket.params.name,"unliked"])

            }
        }
    })



    socket.on("postcomment",async(data)=>{
        getuser(socket,data[0])
        postid=data[2]
        comment=data[1]
        var post=await userposts.findOne({_id:postid})
        var oppositeobj=await users.findOne({_id:post.postedbyid})
        await userposts.updateOne({_id:postid},{$push:{comments:{ppic:socket.params.profilepic,
                                                                name:socket.params.name,
                                                                commentmessage:comment,
                                                                time:new Date().toString()}}})
        console.log(oppositeobj)
        io.to(oppositeobj.socketid).emit("commented",[socket.params.name])
    })
});