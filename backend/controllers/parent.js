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
const userposts = require("../models/userposts")
const admintable = require('../models/admin')
const bcrypt=require("bcrypt")
const saltrounds=10

var postlogin=asyncHandler(async(req,res)=>{
    const obj=await parenttable.findOne({parentemail:req.body.email})
    if(obj){
        bcrypt.compare(req.body.password,obj.password,async(err,result)=>{
            if(result && obj.type===req.body.type){
                await parenttable.updateOne({parentemail:req.body.email},{$set:{status:"online"}})
                const accessToken=jwt.sign({obj},process.env.PARENTSECRET,{expiresIn:"100m"})
                await 
                res.send([accessToken,obj.type])
            }
        })
    }
})
const postparentPosts = asyncHandler(async (req,res)=>{
    var file = req.file
    urls=""
    if(req.file){
        var imageName = generateFileName()
        
        urls='https://jobportaluploads.s3.ap-southeast-2.amazonaws.com/' + imageName
        const tem = await uploadFile(file.buffer, imageName, file.mimetype)
    }
     await parentposts.create({
        posttext:req.body.posttext,
        postedby:req.user.name,
        image:urls,
        category:req.body.category,
        time:new Date().toString()
    })
    await parenttable.updateOne({_id:req.user._id},{$push:{posts:(await parentposts.findOne({image:urls}))._id}})
    res.send("successfully created")
})
const postupdatepost = asyncHandler(async (req,res)=>{
    await parentposts.updateOne({_id:req.body.postid},{$set:{posttext:req.body.posttext}})
    res.send("successfully updated")
    
})
const getparentPosts = asyncHandler(async (req,res)=>{
    var posts=await parenttable.findById(req.user._id)
    ans=[]
    for(i of posts.posts){
        obj=await parentposts.findById(i)
        ans.push(obj)
    }
    res.send(ans)
})
var getpindex=asyncHandler(async(req,res)=>{
    var obj=await parenttable.findOne({_id:req.user._id})
    data={}
    data.obj=obj

    res.send(obj)
})
var getcategory=asyncHandler(async(req,res)=>{
    const obj=await parentposts.find({})
    res.send(obj)
})
var getpprofile=asyncHandler(async(req,res)=>{
    var obj=await parenttable.findById(req.user._id)
    res.send(obj)
})

var getchildprofile=asyncHandler(async(req,res)=>{
    var obj=await user.findOne({email:req.user.email})
    res.send(obj)    
})

var getpindexcontent=asyncHandler(async(req,res)=>{
    var obj=await user.findOne({parentemail:req.user.parentemail})
    ans={}
    ans.obj=obj
    ans.posts=[]
    var postss=await userposts.find({postedbyid:obj._id})
    for(i of postss){
        if((i.status=="pending")){
            ans.posts.push(i)
        }
    }
    res.send(ans)
})
var ppostliked=asyncHandler(async(req,res)=>{
    console.log(req.body,"$")
    if(req.body.number==="1"){
        await userposts.updateOne({_id:req.body.postid},{$push:{likedby:req.user._id}})
        await parentposts.updateOne({_id:req.body.postid},{$push:{likedby:req.user._id}})
        await user.updateOne({_id:req.user._id},{$push:{likedposts:req.body.postid}})
        await parenttable.updateOne({_id:req.user._id},{$push:{likedposts:req.body.postid}})
    }
    else{
        await userposts.updateOne({_id:req.body.postid},{$pull:{likedby:req.user._id}})
        await parentposts.updateOne({_id:req.body.postid},{$pull:{likedby:req.user._id}})
        await user.updateOne({_id:req.user._id},{$pull:{likedposts:req.body.postid}})
        await parenttable.updateOne({_id:req.user._id},{$pull:{likedposts:req.body.postid}})
    }
})
module.exports={
    getpindex,
    postlogin,
    getcategory,
    postparentPosts,
    getparentPosts,
    postupdatepost,
    getchildprofile,
    getpindexcontent,
    getpprofile,
    ppostliked
}