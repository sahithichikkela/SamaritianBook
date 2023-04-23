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
        category:{
            type:String
        },
        comments:{
            type:[Object]
        },
        time:{
            type:String
        }
  },
  { timestamps:true }
);

module.exports = mongoose.model("parentposts", schema);

