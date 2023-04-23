const asyncHandler = require("express-async-handler")
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const {uploadS3}=require("../middlewares/uploads3")
const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')
const {uploadFile}=require("../middlewares/s3")
const crypto = require('crypto')
// const router=express.Router()
//middlewares
const jwt = require("jsonwebtoken");
const fun = require("../middlewares/validateToken");
const funp = require("../middlewares/preventToken");
const usercontrollers=require("../controllers/user")
//models
const users = require("../models/user");



app.post("/signup",uploadS3.single('image'),usercontrollers.signup)
app.post("/uploadtos3",uploadS3.single('image'),usercontrollers.uploadtos3)
app.post("/childlogin",usercontrollers.postlogin)
app.post("/rejectprofile",usercontrollers.rejectprofile)
app.get("/login",funp(process.env.CHILDSECRET),usercontrollers.getlogin)
app.get("/index",fun(process.env.CHILDSECRET),usercontrollers.getindex)
app.get("/friends",fun(process.env.CHILDSECRET),usercontrollers.getfriends)
app.get("/photos",fun(process.env.CHILDSECRET),usercontrollers.getphotos)
app.get("/getprofile",fun(process.env.CHILDSECRET),usercontrollers.getprofile)
app.get("/childmorally",fun(process.env.CHILDSECRET),usercontrollers.childmorally)
app.get("/getuserprofiledetails",fun(process.env.CHILDSECRET),usercontrollers.getuserprofiledetails)
app.get("/getfriendslist",fun(process.env.CHILDSECRET),usercontrollers.getfriendslist)
app.get("/searchfriends",fun(process.env.CHILDSECRET),usercontrollers.getfriendsearch)
app.get("/getgenprofile",fun(process.env.CHILDSECRET),usercontrollers.getgenprofile)
app.get("/getuser",fun(process.env.CHILDSECRET),usercontrollers.getuser)
app.get("/notifications",fun(process.env.CHILDSECRET),usercontrollers.getnotifications)
app.post("/postupdatepropicture",uploadS3.single('image'),fun(process.env.CHILDSECRET),usercontrollers.postupdatepropicture)
app.post("/postupdatecoverpicture",uploadS3.single('image'),fun(process.env.CHILDSECRET),usercontrollers.postupdatecoverpicture)
app.post("/posteditprofile",fun(process.env.CHILDSECRET),usercontrollers.posteditprofile)
app.post("/postliked",fun(process.env.CHILDSECRET),usercontrollers.postliked)
app.post("/postchildposts",fun(process.env.CHILDSECRET),uploadS3.single('image'),usercontrollers.postchildposts)
app.get("/getindexpage",fun(process.env.CHILDSECRET),usercontrollers.getindexpage)
module.exports=app