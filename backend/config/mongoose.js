const mongoose = require("mongoose");
const connectDb = async() =>{
    try{
        //console.log(process.env.CONNECTION_STRING_ATLAS)
        const connect = await mongoose.connect(process.env.CONNECTION_STRING_ATLAS,{ useNewUrlParser: true });
        console.log("database connected: ",connect.connection.host);
       // console.log(connect.connections);

    }
    catch(err){
        console.log(err);
        process.exit(1);
    }

    
      mongoose.connection.on('disconnected', () => {
        console.log('Mongoose connection is disconnected...');
      });
    
      process.on('SIGINT', () => {
        mongoose.connection.close().then(() => {
          console.log(
            'Mongoose connection is disconnected due to app termination...'
          );
          process.exit(0);
        });
      });
}



module.exports = connectDb;


// avg likes per post : db.userposts.aggregate([{$addFields:{likeCount:{$size:'$likedby'}}},{$group:{_id:null,'avg_likes':{$avg:'$likeCount'}}}])
//most hobbies of child  :db.users.aggregate([
//   {$unwind:'$hobbies'},{$group:{_id:'$hobbies',extraCount:{$sum:1}}},{$sort:{extraCount:-1}},{$limit:1}
//   ])

//most active person 
// db.users.aggregate([
//   {$addFields:{'postCount':{$size:'$posts'}}},{$sort:{'postCount':-1}},{$limit:1},{$project:{_id:0,name:1}}
//   ])

//no of pending and accepted posts per child 
//db.userposts.aggregate([
//   {$match:{'postedby':'child4'}},
//   {$group:{_id:'$status',count:{$sum:1}}}
//   ])

//person with more friends
// db.users.aggregate([{
//   $addFields:{
//     'frdSize':{$size:'$friends'}
//   }
// },
//   {$sort:{
//     'frdSize':-1
//   }},{
//     $limit:1
//   }
//   ])

//
// db.userposts.aggregate([{
//   $addFields:{
//     'likedCount':{$size:'$likedby'}
//   }},{
//     $sort:{
//       'likedCount':-1
//     }
//   },{
//     $limit:1
//   },{
//     $unwind:'$likedby'
//   },{
//     $addFields:{
//       objtype:{
//         $toObjectId:'$likedby'
//       }
//     }
//   },{
//     $lookup:{
//       from:'users',
//       localField:'objtype',
//       foreignField: '_id',
//       as:'res'
//     }
//   },{
//     $project:{
//       'res.name':1
//     }
//   }
// ])