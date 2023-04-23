/////models from backend showld be same ass models from sokckets



const path=require("path")
const connectDb = require("./config/mongoose");
const dotenv=require("dotenv").config()
const express = require("express");
const app = express();
let cors = require('cors');
app.use(cors())
const bodyparser=require("body-parser")
const session=require("express-session")
app.use(express.json()) 
app.use(session({
    secret:'SECRET',
    resave:false,
    saveUninitialized:true
}))
connectDb();
const nodemailer=require("nodemailer");
const {google}=require("googleapis");
const OAuth2=google.auth.OAuth2;

const user=require("./models/user")








app.use("",require("./routes/user"));
app.use("",require("./routes/parent"))
app.use("",require("./routes/chat"));
app.use("",require("./routes/admin"))











const myOAuth2Client = new OAuth2(
    "104185428779-c3hbgd8mmcuhv5hs0o5j44kaojhtamrt.apps.googleusercontent.com",
    "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",
    "https://developers.google.com/oauthplayground",
);

myOAuth2Client.setCredentials({
    refresh_token:"1//047ugbGywkNoOCgYIARAAGAQSNwF-L9IrifWFe_N9MYhH818ISIIIDFQfcKLVE-BqZkZjLHNzz31tL9nm23ek5SE88rKWo4c0bKU",

});

const myAccessToken = myOAuth2Client.getAccessToken();

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
         type: "OAuth2",
         user: "logins.samaritianbook@gmail.com", //your gmail account you used to set the project up in google cloud console"
         clientId: "104185428779-c3hbgd8mmcuhv5hs0o5j44kaojhtamrt.apps.googleusercontent.com",
         clientSecret: "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",
         refreshToken: "1//047ugbGywkNoOCgYIARAAGAQSNwF-L9IrifWFe_N9MYhH818ISIIIDFQfcKLVE-BqZkZjLHNzz31tL9nm23ek5SE88rKWo4c0bKU",
         accessToken: myAccessToken //access token variable we defined earlier
}});



app.post('/sendparentemail',async(req,res)=>{
   
   var obj=await user.findOne({email:req.body.email})
   console.log(obj.parentemail)

            const mailOptions = {
                from: 'logins.samaritianbook@gmail.com', // sender
            to: obj.parentemail, // receiver
            subject: 'Child Login alert!', // Subject
            html: `<body class="bg-transparent">
            <main>
    <br>
    <div class="container " style="border: 1px solid black;align-items: center;justify-content: center;text-align: center;">
        <h4 >LOOKS LIKE YOUR CHILD HAS LOGGED IN!</h4><br>
        <img src="https://img.freepik.com/premium-vector/happy-cute-kids-children-jumping-flat-design-style-vector-illustration_194708-810.jpg" alt="">
        <br>
        <h5 >To see activity and more,
        <a  href="http://127.0.0.1:5503/signup.html" style="color: black;">Click here </a></h5>
    </div>
</main>
        </body>`// html body
        
            }  

            transport.sendMail(mailOptions,function(err,result){
                if(err){
                res.send({
                message:err
                })}else{
                transport.close();res.send({
                message:'Email has been sent: check your inbox!'
                })
                }
                })
})

const server=app.listen(3040,(req,res)=>{
    console.log("listening on http://localhost:3040")
})


module.exports = {server}