const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    totalsaving:{
        type:Number,
        default:0
    },
    password:{
        type:String,
        required:true
    },
    expenses:[{
            amount: {
                type: Number,
                required: true
            },

            cause: {
                type: String,
                required: true
            },

            date: {
                type: Date,
                default: Date.now
            }
        }],
    role:{
        type:String,
        default:"user"
    }

},{timestamps:true})

module.exports = mongoose.model("User",UserSchema)