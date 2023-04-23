const asyncHandler = require("express-async-handler");
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
// const router=express.Router()
//middlewares
const jwt = require("jsonwebtoken");
const fun = require("../middlewares/validateToken");
const preventToken = require("../middlewares/preventToken");

//models
const User = require("../models/user");
const parent = require("../models/parent");
const posts = require("../models/parentposts");
const { json } = require("body-parser");
const childposts = require("../models/userposts");
const admintable = require("../models/admin");

//controllers 
const adminController = require('../controllers/admin');
const admin_activity_cap = require("../models/admin_activity");

//content moderator
// const msRestAzure = require('ms-rest-azure');
// const ContentModerator = require('@azure/cognitiveservices-contentmoderator');

//admin login
app.post("/adminlogin", adminController.adminlogin);

app.get(
  "/getAdminDashBoard",
  fun(process.env.ADMINSECRET, "admin"),
  adminController.getAdminDashBoard
);

//display all users by pagination
app.get("/allusers", adminController.allusers);

//display all parent users
app.get("/allusersparent", adminController.allusersparent);

app.get("/viewallusers", adminController.viewallusers);

app.get("/recentUsers", adminController.recentUsers);

app.put("/updateDisable",adminController.putupadateDisable);

app.get("/usersInfo", adminController.usersInfo);

app.post("/addpostt", async (req, res) => {
  await posts.create({
    posttext: req.body.posttext,
    postedby: req.body.postedby,
    image: req.body.image,
    likedby: req.body.likedby,
    category: req.body.category,
    time: new Date().toString(),
  });
  res.send();
});

app.get("/generateReport", adminController.generateReport);

app.get("/top5posts", adminController.top5posts);

app.get("/pendingposts", adminController.pendingposts);

app.get("/poststable", adminController.poststable);

app.get("/admin_activity", adminController.admin_activity);

app.get("/barchat_ages", adminController.barchat_ages);

app.get("/pie_Chart_gender", adminController.pie_Chart_gender);


app.get('/content_moderate',adminController.content_moderate)

app.get("/vinay_temp_route", async (req, res) => {

  
  //console.log(await admintable.updateOne({_id:'6440345c6a21d5c733322669'},{$set:{capped_activity:temp_v._id}}))
  //console.log(await admintable.findOne({email:'vinay@gmail.com'}));
  res.send(await admintable.create({
    email:'admin@gmail.com',
    password:'asdf'
  }))
  //res.send(await admintable.findOne({email:'vinay@gmail.com'}));
  //  var tem =await posts.aggregate([
  //     {
  //         $lookup:{
  //             from: "users",
  //             localField: "postedby",
  //             foreignField: "_id",
  //             as: "product"
  //         }
  //     }
  // ])

  // // console.log(tem);
  // var em2 = await childposts.find().populate('postedby','name')
  // console.log(em2);
  // Product.find()
  //       .populate('farm', 'name')
  //       .then(product=>console.log(product))
  //       .catch(error=>console.log(error));

  //   var endpoint = 'https://eastasia.api.cognitive.microsoft.com/contentmoderator/moderate/v1.0/ProcessImage/Evaluate'
  //   var apikey = '9c0bd30be29247fdb0e9a480750da4e1'
  //   const { ContentModeratorClient } = require('@azure/cognitiveservices-contentmoderator');
  //   const { CognitiveServicesCredentials } = require('ms-rest-azure');

  //   const credentials = new CognitiveServicesCredentials(apikey);
  //   const client = new ContentModeratorClient(credentials, endpoint);

  //   client.imageModeration.evaluateFileInput('path/to/photo.jpg', {
  //     CacheImage: true,
  //     Classify: true
  // }).then((result) => {
  //     console.log(result);
  // }).catch((err) => {
  //     console.error(err);
  // });
  
});
module.exports = app;

// {
//     "name":"c13",
//     "email":"c13@gmail.com",
//     "location":"hyd",
//     "age":35,
//     "parentemail":"p10@gmail.com",
//     "gender":"female",
//     "password":"asdf",
//     "type":"child"
// }


//adminlogin,getAdminDashBoard,allusers,allusersparent,viewallusers,recentUsers,putupadateDisable,usersInfo,generateReport,top5posts,pendingposts,poststable
//admin_activity,barchat_ages,pie_Chart_gender,content_moderate