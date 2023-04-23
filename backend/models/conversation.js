const mongoose = require("mongoose");

let schema = new mongoose.Schema({
    members:[String]
});
module.exports = mongoose.model("converstaion", schema);
