const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    name:{
        type:String,
        requires:true,
        validate:{
            validator: function(v) {
              return /^[a-zA-Z\s]{1,40}$/.test(v);
            },
            message: 'Name must contain only alphabets and spaces, and be at most 40 characters long',
          }
    },
    email:{
        type:String,
        requires:true,
        validate:  {
            validator: function(v) {
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Invalid email address format',
          },
    },
    password:{
        type:String,
        requires:true,
        validate:  {
            validator: function(v) {
              return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(v);
            },
            message: 'Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*)',
          },
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
        requires:true,
        validate:  {
            validator: function(v) {
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Invalid email address format',
          },
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
module.exports = mongoose.model("Child", schema);


// {
//     "_id": {
//       "$oid": "6440345c6a21d5c733322669"
//     },
//     "email": "admin@gmail.com",
//     "password": "asdf",
//     "activity": [
//       "Fri Apr 21 2023 19:36:19 GMT+0530 (India Standard Time)",
//       "Fri Apr 21 2023 19:39:23 GMT+0530 (India Standard Time)",
//       "Fri Apr 21 2023 19:45:15 GMT+0530 (India Standard Time)",
//       "Fri Apr 21 2023 20:03:14 GMT+0530 (India Standard Time)",
//       "Fri Apr 21 2023 22:14:54 GMT+0530 (India Standard Time)",
//       "Tue Apr 25 2023 11:11:26 GMT+0530 (India Standard Time)",
//       "Tue Apr 25 2023 12:03:58 GMT+0530 (India Standard Time)",
//       "Tue Apr 25 2023 15:17:41 GMT+0530 (India Standard Time)",
//       "Thu Apr 27 2023 15:43:08 GMT+0530 (India Standard Time)",
//       "Thu Apr 27 2023 21:21:24 GMT+0530 (India Standard Time)",
//       "Thu Apr 27 2023 23:54:37 GMT+0530 (India Standard Time)"
//     ],
//     "updatedAt": {
//       "$date": {
//         "$numberLong": "1682619877963"
//       }
//     },
//     "browsers": {
//       "Chrome 112.0.0": 2,
//       "Firefox 112.0.0": 1
//     },
//     "capped_activity": {
//       "$oid": "6448c7c4393c6e7db776950c"
//     }
//   }