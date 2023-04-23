const asyncHandler = require("express-async-handler")
const jwt=require("jsonwebtoken")
const conversation = require("../models/conversation")
const messages = require("../models/messages")
const user=require("../models/user")
const parenttable=require("../models/parent")
const parentposts=require("../models/parentposts")
const {uploadS3}=require("../middlewares/uploads3")
const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')
const {uploadFile}=require("../middlewares/s3")
const crypto = require('crypto')
const bcrypt=require("bcrypt")
const saltrounds=10
const userposts=require("../models/userposts")

const compiler=require("compilex")
const { response } = require("../routes/user")

var exec = require('child_process').exec;
var signup=asyncHandler(async(req,res)=>{
    var file = req.file
    urls=""
    if(req.file){
        var imageName = generateFileName()
        urls='https://jobportaluploads.s3.ap-southeast-2.amazonaws.com/' + imageName
        const tem = await uploadFile(file.buffer, imageName, file.mimetype)
    }
    bcrypt.hash(req.body.password,saltrounds,async(err,hash)=>{
        if(err){
            console.log(err)
        }
        console.log(req.body)
        if(req.body.type=="children"){
            await user.create({
                name:req.body.name,
                email:req.body.email,
                parentemail:req.body.parentemail,
                location:req.body.location,
                age:req.body.age,
                aadharid:urls,
                gender:req.body.gender,
                password:hash,
                type:req.body.type,
            })
        }
        else{
            await parenttable.create({
                name:req.body.name,
                email:req.body.email,
                parentemail:req.body.parentemail,
                location:req.body.location,
                age:req.body.age,
                aadharid:urls,
                gender:req.body.gender,
                password:hash,
                type:req.body.type,
            })
        }
    })
    var obj=await user.findOne({email:req.body.email})
    if(!obj){obj=await parenttable.findOne({parentemail:req.body.email})}
    res.send(obj)
})
var rejectprofile=asyncHandler(async(req,res)=>{
    objid=JSON.parse(req.body.obj)._id
    if(req.body.value==1){
        await user.deleteOne({_id:objid})
        await parenttable.deleteOne({_id:objid})
    }
    res.send("hello")
})
var uploadtos3=asyncHandler(async(req,res)=>{
    var file = req.file
    urls=""
    if(req.file){
        var imageName = generateFileName()
        urls='https://jobportaluploads.s3.ap-southeast-2.amazonaws.com/' + imageName
        const tem = await uploadFile(file.buffer, imageName, file.mimetype)
    }
     exec('curl --user "MV2uZWIvh6hNuCxpxMIfIBfV:S47JiMyIzmMQNMSMe1Ge6wsj9zV5oejwSN8HPr8R3Sn9YoiX" "https://api.everypixel.com/v1/faces?url='+urls+'"',function(err,stdOut,stdErr){
        if(err){
            console.log(err)
        }
        res.send(stdOut)
    })


})


var postlogin=asyncHandler(async(req,res)=>{
    console.log(req.body)
    const obj=await user.findOne({email:req.body.email})
    if(obj){
        bcrypt.compare(req.body.password,obj.password,async(err,result)=>{
            if(result == false){
                // res.body.okay = false
                res.send();
            }
            console.log(result)
            if(result && obj.type===req.body.type && !obj.disable){
                await user.updateOne({email:req.body.email},{$set:{status:"online"}})
                const accessToken=jwt.sign({obj},process.env.CHILDSECRET,{expiresIn:"100m"})
                
                res.send([accessToken,obj.type,{"okay":true}])

            }
        })
    }
})
var getfriendslist=asyncHandler(async(req,res)=>{
    var userobj=await user.findOne({_id:req.user._id})
    var ans=await user.find({_id:{$in:userobj.friends}})
    res.send(ans)
})
var getlogin=asyncHandler(async(req,res)=>{
    res.send("login")
})
var getindex=asyncHandler(async(req,res)=>{
    data={}
    data.friendslist=[]
    currobj=await user.findById(req.user._id)
    friendslist=currobj.friends
    for(friend of friendslist){
        data.friendslist.push(await user.findOne({_id:friend}))
    }
    
    data.requestlist=[]
    reqlist=currobj.requests
    for(id of reqlist){
        var obj=await user.findById(id.oppositeid)
        data.requestlist.push(obj)
    }
    data.profile=currobj
    data.messages=[]
    var conversations=await conversation.find({members:{$in:[req.user._id]}})
    for(thread of conversations){
        var texts=await messages.findOne({conversationid:thread.id})
        oppositeid=""
        if(thread.members[0]===req.user._id){
            oppositeid=thread.members[1]
        }
        else{
            oppositeid=thread.members[0]
        }
        if(texts){
            last_message=texts.messages[texts.messages.length-1]
            var username=await user.findById(oppositeid)
            data.messages.push({name:username.name,
                                profilepic:username.profilepic,
                                latest_message:last_message.message,
                                oppositeid:oppositeid,
                                time:last_message.time})
        }
    }
    res.send(data)
})
var getnotifications=asyncHandler(async(req,res)=>{
    var ans=await user.findOne({_id:req.user._id})
})
var getuser=asyncHandler(async(req,res)=>{
    var obj=await user.findById(req.headers.oppositeid)
    return res.send(obj)
})
var getprofile=asyncHandler(async(req,res)=>{
    var obj=await user.findById(req.user._id)
    res.send(obj)
})
var getphotos = asyncHandler(async(req,res)=>{
    ans={}
    ans.posts=await userposts.find({postedbyid:req.user._id})
    ans.profile=await user.findOne({_id:req.user._id})
    res.send(ans)
})
var getfriends = asyncHandler(async(req,res)=>{
})
var getuserprofiledetails = asyncHandler(async(req,res)=>{
    var obj=await user.findById(req.user._id)
    ans={}
    ans.profile=obj
    ans.nonfriends=[]
    ans.sentrequests=[]
    ans.friends=[]
    ans.pendingrequests=[]
    var allusers=await user.find({})
    for(eachuser of allusers){
        if(!find(obj.requests,eachuser._id) && 
        !find(obj.sentrequests,eachuser._id) && 
        !obj.friends.includes(eachuser._id) && 
        eachuser._id.toString()!=obj._id.toString()){
            ans.nonfriends.push(eachuser)
        }
        if(!find(obj.requests,eachuser._id) && 
        find(obj.sentrequests,eachuser._id) && 
        !obj.friends.includes(eachuser._id) && 
        eachuser._id.toString()!=obj._id.toString()){
            ans.sentrequests.push(eachuser)
        }
        if(!find(obj.requests,eachuser._id) && 
        !find(obj.sentrequests,eachuser._id) && 
        obj.friends.includes(eachuser._id) && 
        eachuser._id.toString()!=obj._id.toString()){
            ans.friends.push(eachuser)
        }
        if(find(obj.requests,eachuser._id) && 
        !find(obj.sentrequests,eachuser._id) && 
        !obj.friends.includes(eachuser._id) && 
        eachuser._id.toString()!=obj._id.toString()){
            ans.pendingrequests.push(eachuser)
        }
    }
    res.send(ans)
})
var getfriendsearch=asyncHandler(async(req,res)=>{
    obj=await user.find({name: { $regex: '.*' + req.headers.text + '.*' } });

    res.send(obj)
})
function find(cobj,id){
    for( item of cobj){
        if(item.oppositeid.toString()==id.toString())return true
    }
    return false
}
function findtime(cobj,id){
    for(item of cobj){
        if(item.oppositeid.toString()==id.toString())return item.time
    }
}
var getgenprofile=asyncHandler(async(req,res)=>{
    obj=await user.findOne({_id:req.headers.oppositeid})
    currobj=await user.findById(req.user._id)
    flag=0
    if(req.user._id==obj._id){
        return res.send("myprofile")
    }
    ans={}
    if(find(currobj.sentrequests,req.headers.oppositeid)){
        ans.buttonstatus="Request sent"
        ans.time=findtime(currobj.sentrequests,req.headers.oppositeid)
        flag=1
    }
    if((obj.friends).includes(req.user._id)){
        ans.buttonstatus="request accepted"
        flag=2
    }
    if(find(currobj.requests,req.headers.oppositeid)){
        ans.buttonstatus="acceptreject"
        ans.time=findtime(currobj.requests,req.headers.oppositeid)
        flag=3
    }
    if(flag==0){
        ans.buttonstatus="send req"
    }
    ans.data=obj
    return res.send(ans)

})
var postupdatecoverpicture=asyncHandler(async(req,res)=>{
    var file = req.file 
    var imageName = generateFileName()
    urls='https://jobportaluploads.s3.ap-southeast-2.amazonaws.com/' + imageName
    const tem = await uploadFile(file.buffer, imageName, file.mimetype)
    await user.updateOne({_id:req.user._id},{$set:{coverpic:urls}})  
    res.send("successfully uploaded profile picture")
})
var postupdatepropicture=asyncHandler(async(req,res)=>{
    var file = req.file 
    var imageName = generateFileName()
    urls='https://jobportaluploads.s3.ap-southeast-2.amazonaws.com/' + imageName
    const tem = await uploadFile(file.buffer, imageName, file.mimetype)
    await user.updateOne({_id:req.user._id},{$set:{profilepic:urls}})  
    res.send("successfully uploaded profile picture")
})
var posteditprofile=asyncHandler(async(req,res)=>{
    await user.updateOne({_id:req.user._id},{$set:{location:req.body.location,
                                                    hobbies:req.body.hobbiesarr,
                                                    somethingaboutme:req.body.somethingaboutme,
                                                    education:req.body.education}})
    res.send("added")
})
var postchildposts=asyncHandler(async (req,res)=>{
    var file = req.file
    urls=""
    if(req.file){
        var imageName = generateFileName()
        urls='https://jobportaluploads.s3.ap-southeast-2.amazonaws.com/' + imageName
        const tem = await uploadFile(file.buffer, imageName, file.mimetype)
    }
     userposts.create({
        posttext:req.body.posttext,
        postedby:req.user.name,
        image:urls,
        status:"pending",
        time:new Date().toString(),
        postedbyid:req.user._id
    }).then((data)=>{
        res.send(data)
    })
})
var getindexpage=asyncHandler(async (req,res)=>{
    ans={}
    ans.posts=[]
    var friendslist=(await user.findOne({_id:req.user._id})).friends
    var requestlist=(await user.findOne({_id:req.user._id})).requests
    for(friend of friendslist){
        var friendposts=await userposts.find({postedbyid:friend})
        obj=[]
        var profilep=(await user.findOne({_id:friend})).profilepic
        obj.push(profilep)
        for(post of friendposts){
            if (post.status==="accepted"){
                obj.push(post)
            }
        }
        ans.posts.push(obj)
    }
    var myposts=await userposts.find({postedbyid:req.user._id})
    obj=[]
    var profilep=(await user.findOne({_id:req.user._id})).profilepic
    obj.push(profilep)
    for(post of myposts){
        if (post.status==="accepted"){
            obj.push(post)
        }
    }
    ans.posts.push(obj)
    ans.nonfriends=[]
    var totalusers=await user.find({})
    for(person of totalusers){
        if(!find(requestlist,person._id) && 
        !friendslist.includes(person._id) &&
        !(req.user._id.toString()==person._id.toString()))ans.nonfriends.push(person)
    } 
    ans.notifications=(await user.findOne({_id:req.user._id})).notifications
    ans.profile=await user.findById(req.user._id)
    res.send(ans)
})
var postliked=asyncHandler(async(req,res)=>{
    if(req.body.number==="1"){
        await userposts.updateOne({_id:req.body.postid},{$push:{likedby:req.user._id}})
        await parentposts.updateOne({_id:req.body.postid},{$push:{likedby:req.user._id}})
        await user.updateOne({_id:req.user._id},{$push:{likedposts:req.body.postid}})
    }
    else{
        await userposts.updateOne({_id:req.body.postid},{$pull:{likedby:req.user._id}})
        await parentposts.updateOne({_id:req.body.postid},{$pull:{likedby:req.user._id}})
        await user.updateOne({_id:req.user._id},{$pull:{likedposts:req.body.postid}})
    }
})
var childmorally=asyncHandler(async(req,res)=>{
    const obj=await parentposts.find({})
    ans={}
    ans.posts=obj
    ans.profile=await user.findById(req.user._id)
    res.send(obj)
})
module.exports={signup,
    postlogin,
    postliked,
    getlogin,
    getindex,childmorally,
    getuser,
    getnotifications,
    getprofile,uploadtos3,
    getphotos,getfriends
    ,getuserprofiledetails,getfriendslist
    ,getfriendsearch,getgenprofile,
    postupdatecoverpicture,postupdatepropicture,
    posteditprofile,getindexpage,
    postchildposts,rejectprofile
}