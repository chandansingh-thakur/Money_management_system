const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/Users.models')

//authenticating user with his email and password 
// and creating a jwt token which he will use for further account operations
module.exports.auth = async (req,res,next)=>{
    try{
        const {email,password} = req.body

        if (!email||!password){
            return res.send("Enter name email.")
        }
        const user = await User.findOne({email:email})
        if (!user){
            return res.status(400).send("User not found.")
        }
        const ismatching = await bcrypt.compare(password,user.password)
        if (!ismatching){
            return res.status(400).send("Wrong password enter agin! ")
        }
        const token = jwt.sign({id:user._id,name:user.name,email:user.email,role:user.role},process.env.JWT,{expiresIn:"2h"})
        req.token = token
        next()
    }
    catch(err){
        next(err)}
}

module.exports.autherize = async (req,res,next)=>{
    try{
        const autherized = req.headers.authorization
        if (!autherized||!autherized.startsWith("Bearer ")){
            return res.status(401).send("Autherization requierd")
        }
        const token = autherized.split(" ")[1]
        const decode = jwt.verify(token,process.env.JWT)
        if (!decode){
            res.status(400).send("Wrong token.")
        }
        req.user=decode
        next()
    }catch(err){
        next(err)}
}