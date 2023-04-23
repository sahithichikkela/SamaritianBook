//used to validate the token 
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const fun = (key,str="")=>{
    const validateToken = asyncHandler(async (req,res,next)=>{
        token=req.headers.token
        if(!token){
            return res.status(404).send("signup.html")
            throw new Error("no token")
        }
        adminredirection = "template/adminDashBoard.html"
        redirection="index.html"
        if(key=="children")redirection="p-index.html"
        else if(key == process.env.ADMINSECRET) redirection="signup.html"

        jwt.verify(token,key,asyncHandler(async(err,decoded)=>{
            if(err){
                console.log(redirection)
                if(str=="")
                return res.status(401).send(adminredirection)
                else return res.status(401).send(redirection)
                throw new Error("not a valid token")
            }
            req.user=decoded.obj
            return next();
        }))
    });
    return validateToken;
}
module.exports = fun;