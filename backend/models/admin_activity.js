




const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    activity: {
      timestamp: Date,
      action: String
    }
  },
  {
    capped: {
      size: 100000,
      max: 5
    },
    timestamps: true
  }
);

module.exports = mongoose.model("adminactivity", schema);