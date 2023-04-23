const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    conversationid:String,
    messages:{type:[Object],min:1},
  },
  { timestamps:true }
);
module.exports = mongoose.model("mesages", schema);
