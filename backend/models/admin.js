const mongoose = require("mongoose");
var encrypt = require('mongoose-encryption');

let schema = new mongoose.Schema(
  {
    email:{
        type:String,
    },
    password:{
        type:String,
    },
    activity:{
        type:[String]
    },
    capped_activity:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'adminactivity'
    },
    browsers:{
        type:Object,
        default:{}
    },
    type:{
        type:String,
        default:"admin"
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
    }
  },
  { timestamps:true }
);



var secret ='ghjk';
schema.plugin(encrypt, { secret: secret,authenticate: false,encryptedFields: ['type',
'password','capped_activity','lastactivetime','socketid','status'
] });

module.exports = mongoose.model("admin", schema);
