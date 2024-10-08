const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    name:{
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
    parentemail:{
        type:String,
        requires:true
    },
    age:{
        type:String,
        requires:true
    },
    location:{
        type:String,
        requires:true
    },
    aadharid:{
        type:String,
        requires:true
    },
    disable:{
        type:Boolean,
        default:true
    },
    gender:{
        type:String,
        requires:true
    },
    type:{
        type:String,
        requires:true
    },
    requests:{
        type:[Object],
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
    notifications:{
        type:[Object]
    },
    sentrequests:{
        type:[Object]
    },
    hobbies:[String],
    education:String,
    somethingaboutme:String
  },
  { timestamps:true }
);
module.exports = mongoose.model("User", schema);