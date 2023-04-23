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

//content moderator
// const msRestAzure = require('ms-rest-azure');
// const ContentModerator = require('@azure/cognitiveservices-contentmoderator');

//admin login
app.post("/adminlogin", async (req, res) => {
  const obj = await admintable.findOne({ email: req.body.email });
  console.log(req.body, obj);
  if (obj) {
    if (obj.password == req.body.password && obj.type == req.body.type) {
      const accessToken = jwt.sign({ obj }, process.env.ADMINSECRET, {
        expiresIn: "100m",
      });
      console.log("success");
      var update_login_time = await admintable.updateOne(
        { email: req.body.email },
        { $push: { activity: new Date().toString() } }
      );
      res.send([accessToken, obj.type]);
    }
  }
});

app.get(
  "/getAdminDashBoard",
  fun(process.env.ADMINSECRET, "admin"),
  (req, res) => {
    res.send();
  }
);

//display all users by pagination
app.get("/allusers", async (req, res) => {
  const no_of_docs_each_page = 5; // 5 docs in single page
  const current_page_number = req.headers.pageno; // page number
  ans = await User.find({})
    .skip(no_of_docs_each_page * current_page_number)
    .limit(no_of_docs_each_page);
  res.send({ data: ans, count: (await User.find({})).length / 5 });
});

//display all parent users
app.get("/allusersparent", async (req, res) => {
  const no_of_docs_each_page = 5; // 5 docs in single page
  const current_page_number = req.headers.pageno; // page number
  ans = await parent
    .find({})
    .skip(no_of_docs_each_page * current_page_number)
    .limit(no_of_docs_each_page);
  res.send({ data: ans, count: (await parent.find({})).length / 5 });
});

app.get("/viewallusers", async (req, res) => {
  ans = await User.find({});
  if (!req.headers.viewflag) ans = ans.limit(5);
  res.send({ data: ans });
});

app.get("/recentUsers", async (req, res) => {
  recent_users = (
    await User.aggregate([{ $match: {} }, { $sort: { createdAt: -1 } }]).limit(
      5
    )
  ) //getting top five recent users
    .map((item) => {
      item["localTime"] = new Date(item.createdAt).toLocaleString(undefined, {
        timeZone: "Asia/Kolkata",
      });
      return item;
    }); //converting to local time

  res.send(recent_users);
});

app.put("/updateDisable", async (req, res) => {
  await User.updateOne({ _id: req.body._id }, [
    { $set: { disable: { $not: "$disable" } } },
  ]);
  res.send();
});

app.get("/usersInfo", async (req, res) => {
  async function totalIncUser() {
    var last24users = (
      await User.find({
        createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      })
    ).length;
    var total = (await User.find({})).length - last24users;
    return (last24users * 100) / total;
  }
  async function postsAnaylitics() {
    var last24users = (
      await childposts.find({
        createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      })
    ).length;
    var total = (await childposts.find({})).length - last24users;
    return (last24users * 100) / total;
  }
  var requiredParentUsers = (
    await parent.find({
      createdAt: {
        $gt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        $lt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    })
  ).length;
  var requiredChildUsers = (
    await User.find({
      createdAt: {
        $gt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        $lt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    })
  ).length;
  var requiredPosts = (
    await childposts.find({
      createdAt: {
        $gt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        $lt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    })
  ).length;
  var tem2 = await childposts.aggregate([
    {
      $lookup: {
        from: "User",
        localField: "postedby",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $match: {
        createdAt: {
          $gt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          $lt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      },
    },
    {
      $group: {
        _id: "$postedby",
      },
    },
  ]);
  var activeUsers = tem2.length;
  data = {
    active: (await User.find({ status: "online" })).length,
    total: (await User.find({})).length,
    posts: (await childposts.find({})).length,
    totalIncUser: await totalIncUser(),
    totalIncPost: await postsAnaylitics(),
    parentUsers: requiredParentUsers,
    childUsers: requiredChildUsers,
    postsc: requiredPosts,
    activeUsers: activeUsers,
  };
  console.log(data);
  res.send(data);
});

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

app.get("/generateReport", async (req, res) => {
  var requiredParentUsers = (
    await parent.find({
      createdAt: {
        $gt: new Date(req.headers.startdate),
        $lt: new Date(req.headers.enddate),
      },
    })
  ).length;
  var requiredChildUsers = (
    await User.find({
      createdAt: {
        $gt: new Date(req.headers.startdate),
        $lt: new Date(req.headers.enddate),
      },
    })
  ).length;
  var requiredPosts = (
    await childposts.find({
      createdAt: {
        $gt: new Date(req.headers.startdate),
        $lt: new Date(req.headers.enddate),
      },
    })
  ).length;
  var tem2 = await childposts.aggregate([
    {
      $lookup: {
        from: "User",
        localField: "postedby",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $match: {
        createdAt: {
          $gt: new Date(req.headers.startdate),
          $lt: new Date(req.headers.enddate),
        },
      },
    },
    {
      $group: {
        _id: "$postedby",
      },
    },
  ]);
  var activeUsers = tem2.length;
  var totalUsers = await User.find({
    createdAt: {
      $gt: new Date(req.headers.startdate),
      $lt: new Date(req.headers.enddate),
    },
  });
  totalposts = await childposts.aggregate([
    {
      $addFields: {
        localTime: {
          $dateToString: {
            format: "%Y-%m-%d %H:%M:%S",
            date: { $toDate: "$createdAt" },
            timezone: "Asia/Kolkata",
          },
        },
      },
    },
    {
      $match: {
        createdAt: {
          $gt: new Date(req.headers.startdate),
          $lt: new Date(req.headers.enddate),
        },
      },
    },
  ]);
  console.log(totalposts, "iop");
  res.send({
    parentUsers: requiredParentUsers,
    childUsers: requiredChildUsers,
    postsc: requiredPosts,
    activeUsers: activeUsers,
    data: totalUsers,
    posts: totalposts,
  });
});

app.get("/top5posts", async (req, res) => {
  var top5posts = await childposts
    .aggregate([
      {
        $addFields: {
          likeCount: { $size: "$likedby" },
        },
      },
      {
        $sort: { likeCount: -1 },
      },
    ])
    .limit(5);
  res.send(top5posts);
});

app.get("/pendingposts", async (req, res) => {
  recent_pending_posts = await childposts
    .aggregate([
      {
        $addFields: {
          localTime: {
            $dateToString: {
              format: "%Y-%m-%d %H:%M:%S",
              date: { $toDate: "$createdAt" },
              timezone: "Asia/Kolkata",
            },
          },
        },
      },
      { $match: { status: "pending" } },
      { $sort: { createdAt: 1 } },
    ])
    .limit(5);
  res.send(recent_pending_posts);
});

app.get("/poststable", async (req, res) => {
  const { target_search } = req.headers;
  if (target_search) {
    console.log(target_search);
    var ans = await childposts.aggregate([
      {
        $search: {
          index: "vinay",
          text: {
            query: target_search,
            path: ["posttext"],
          },
        },
      },
    ]);
    console.log(ans);
    res.send(ans);
  } else {
    res.send(await childposts.find({}));
  }
});

app.get("/admin_activity", async (req, res) => {
  var browsers = (await admintable.findOne()).browsers;
  console.log(browsers);
  var sum = Object.values(browsers).reduce((x, y) => {
    return x + y;
  }, 0);
  res.send([
    (await admintable.find())[0].activity
      .reverse()
      .splice(0, 5)
      .map((data) => {
        return data.substring(0, data.indexOf("GMT"));
      }),
    Object.keys(browsers).reduce((obj, key) => {
      const newKey = key
        .toLowerCase()
        .replace(/\d+/g, "")
        .replace(/\s+/g, "")
        .replaceAll(".", "");
      obj[newKey] = (browsers[key] * 100) / sum;
      return obj;
    }, {}),
  ]);
});

app.get("/barchat_ages", async (req, res) => {
  res.send(
    await User.aggregate([
      { $group: { _id: "$age", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { age: "$_id", count: 1, _id: 0 } },
    ])
  );
});

app.get("/pie_Chart_gender", async (req, res) => {
  res.send(
    await User.aggregate([
      { $group: { _id: "$gender", count: { $sum: 1 } } },
      { $project: { gender: "$_id", count: 1, _id: 0 } },
    ])
  );
});


app.get('/content_moderate',async (req,res)=>{
  var pos = await childposts.findOne({ _id: req.headers.id });
  var tem = pos.image;
  const axios = require("axios");

  const config = {
    headers: {
      "Ocp-Apim-Subscription-Key": "00569c9adc914b18917919f848974705",
      "Content-Type": "application/json",
    },
  };
  var cv =
    "https://thumbs.dreamstime.com/b/beautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg";
  const requestBody = {
    DataRepresentation: "URL",
    Value: `${tem}`,
  };
  axios
    .post(
      "https://eastasia.api.cognitive.microsoft.com/contentmoderator/moderate/v1.0/ProcessImage/Evaluate",
      requestBody,
      config
    )
    .then((response) => {
      console.log(response.data);
      var result = {};
      result["result"] = response.data.Result;
      result["prob"] = Math.round(
        ((response.data.AdultClassificationScore +
          response.data.RacyClassificationScore) *
          100) /
          2
      );
      res.send([result, pos]);
    })
    .catch((error) => {
      console.error(error);
    });
})
app.get("/vinay_temp_route", async (req, res) => {
  
  //console.log(await admintable.findOne({email:'vinay@gmail.com'}));
  res.send(await admintable.findOne({email:'vinay@gmail.com'}));
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