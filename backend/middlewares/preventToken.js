//used to validate the token 
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const fun = (key)=>{
    const preventToken = asyncHandler(async (req,res,next)=>{
        token=req.headers.token
        flag=0
        if(!token){
            return next()
        }
        jwt.verify(token,key,asyncHandler(async(err,decoded)=>{
            if(err){
                return res.status(401).send("p-index.html")
                throw new Error("error occured in decrypting")
            }
            flag=1
        }))
        if(flag==1){
            return res.status(400).send("index.html")
            throw new Error("token is already present")
        }
    });
    return preventToken
}
module.exports = fun;