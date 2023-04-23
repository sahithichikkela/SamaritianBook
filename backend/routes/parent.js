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
const parentcontrollers=require("../controllers/parent")
//models
const users = require("../models/user");
app.get("/p-index",fun(process.env.PARENTSECRET),parentcontrollers.getpindex)
app.get("/getp-index",fun(process.env.PARENTSECRET),parentcontrollers.getpindexcontent)
app.get("/getpprofile",fun(process.env.PARENTSECRET),parentcontrollers.getpprofile)
app.post("/parentlogin",parentcontrollers.postlogin)
app.post("/ppostliked",fun(process.env.PARENTSECRET),parentcontrollers.ppostliked)
app.post("/postupdatepost",parentcontrollers.postupdatepost)
app.get("/getcategory",fun(process.env.PARENTSECRET),parentcontrollers.getcategory)
app.post("/postparentPosts",fun(process.env.PARENTSECRET),uploadS3.single('image'),parentcontrollers.postparentPosts)
app.get("/getparentposts",fun(process.env.PARENTSECRET),parentcontrollers.getparentPosts)
app.get("/getchildprofile",fun(process.env.PARENTSECRET),parentcontrollers.getchildprofile)
module.exports=app