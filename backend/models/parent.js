const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    name:{
        type:String,
        requires:true
    },
    parentemail:{
        type:String,
        requires:true
    },
    email:{
        type:String,
        requires:true
    },
    password:{
        type:String,
        requires:true
    },
    profilepic:{
        type:String,
    },
    coverpic:{
        type:String,

    },
    friends:{
        type:[String],
    },
    posts:{
        type:[String],
    },
    likedposts:{
        type:[String],
    },
    gender:{
        type:String,
        requires:true
    },
    type:{
        type:String,
        requires:true
    },
    age:{
        type:String,
        requires:true
    },
    aadharid:{
        type:String,
        requires:true
    },
    status:{
        type:String,
        default:""
    },
    socketid:{
        type:String,
        default:""
    },
    lastactivetime:{
        type:String,
        default:""
    },
  },
  { timestamps:true }
);
module.exports = mongoose.model("parent", schema);
