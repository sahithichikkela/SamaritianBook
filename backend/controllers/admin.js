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
const admin_activity_cap = require("../models/admin_activity");

const adminlogin = asyncHandler(async (req, res) => {
  try {
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
        console.log(await admintable.findOne({ email: req.body.email }))
        await admin_activity_cap.create({});
        res.send([accessToken, obj.type]);
      }
    }
  } catch (error) {}
});

const getAdminDashBoard = asyncHandler(async (req, res) => {
  res.send();
});

const allusers = asyncHandler(async (req, res) => {
  try {
    const no_of_docs_each_page = 5; // 5 docs in single page
    const current_page_number = req.headers.pageno; // page number
    ans = await User.find({})
      .skip(no_of_docs_each_page * current_page_number)
      .limit(no_of_docs_each_page);
    res.send({ data: ans, count: (await User.find({})).length / 5 });
  } catch (error) {}
});

const allusersparent = asyncHandler(async (req, res) => {
  try {
    const no_of_docs_each_page = 5; // 5 docs in single page
    const current_page_number = req.headers.pageno; // page number
    ans = await parent
      .find({})
      .skip(no_of_docs_each_page * current_page_number)
      .limit(no_of_docs_each_page);
    res.send({ data: ans, count: (await parent.find({})).length / 5 });
  } catch (error) {}
});

const viewallusers = asyncHandler(async (req, res) => {
  try {
    ans = await User.find({});
    if (!req.headers.viewflag) ans = ans.limit(5);
    res.send({ data: ans });
  } catch (error) {}
});

const recentUsers = asyncHandler(async (req, res) => {
  try {
    recent_users = (
      await User.aggregate([
        { $match: {} },
        { $sort: { createdAt: -1 } },
      ]).limit(5)
    ) //getting top five recent users
      .map((item) => {
        item["localTime"] = new Date(item.createdAt).toLocaleString(undefined, {
          timeZone: "Asia/Kolkata",
        });
        return item;
      }); //converting to local time

    res.send(recent_users);
  } catch (error) {}
});

const putupadateDisable = asyncHandler(async (req, res) => {
  try {
    const session = await mongoose.startSession();

    await User.updateOne({ _id: req.body._id }, [
      { $set: { disable: { $not: "$disable" } } },
    ]);
    res.send();
  } catch (error) {}
});

const usersInfo = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {}
});

const generateReport = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {}
});

const top5posts = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {}
});

const pendingposts = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {}
});

const poststable = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {}
});

const admin_activity = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {}
});

const barchat_ages = asyncHandler(async (req, res) => {
  try {
    res.send(
      await User.aggregate([
        { $group: { _id: "$age", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $project: { age: "$_id", count: 1, _id: 0 } },
      ])
    );
  } catch (error) {}
});

const pie_Chart_gender = asyncHandler(async (req, res) => {
  try {
    res.send(
      await User.aggregate([
        { $group: { _id: "$gender", count: { $sum: 1 } } },
        { $project: { gender: "$_id", count: 1, _id: 0 } },
      ])
    );
  } catch (error) {}
});

const content_moderate = asyncHandler(async (req, res) => {
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
});

module.exports = {
  adminlogin,
  getAdminDashBoard,
  allusers,
  allusersparent,
  viewallusers,
  recentUsers,
  putupadateDisable,
  usersInfo,
  generateReport,
  top5posts,
  pendingposts,
  poststable,
  admin_activity,
  barchat_ages,
  pie_Chart_gender,
  content_moderate,
};
