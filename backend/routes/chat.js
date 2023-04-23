const asyncHandler = require("express-async-handler")
const express = require("express");
const app = express();
const path = require("path");
const jwt = require("jsonwebtoken");
const fun = require("../middlewares/validateToken");
const funp = require("../middlewares/preventToken");
const conversations = require("../models/conversation");
const messages = require('../models/messages');
const { timeStamp } = require("console");
const conversation = require("../models/conversation");
const messagetable = require("../models/messages");
const user=require("../models/user")
app.post("/conversations",async(req,res)=>{
    await conversations.create({members:req.body.ids})
    res.send("done")
})
app.get("/conversations",async(req,res)=>{
})
app.get("/messages",fun(process.env.CHILDSECRET),async(req,res)=>{
    var conversationid=await conversations.findOne({members:{$all:[req.user._id,req.headers.oppositeid]}})
    if(!conversationid)return res.send({messages:[]})
    conversationid=(conversationid._id.toString())
    var messagesarr=await messagetable.findOne({conversationid:conversationid})
    var oppositeobj=await user.findOne({_id:req.headers.oppositeid})
    if(!messagesarr){
        return res.send(["bigin chat",oppositeobj])
    }
    res.send([messagesarr,conversationid,oppositeobj])

})
module.exports = app;
