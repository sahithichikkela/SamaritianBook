const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
        posttext:{
            type:String,
            requires:true,
            min:1
          
        },
        postedby : {
            type:String,  
        },
        image:{
            type:String,
        },
        likedby :{
            type:[Object]
        },
        status:{
            type:String
        },
        comments:{
            type:[Object]
        },
        time:{
            type:String
        },
        postedbyid:{
            type:String
        }
  },
  { timestamps:true }
);

module.exports = mongoose.model("userposts", schema);

