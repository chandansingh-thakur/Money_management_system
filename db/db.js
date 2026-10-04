const mongoose = require('mongoose')
const dns = require('dns')

dns.setServers(["8.8.8.8",'8.8.4.4'])

const connectdb=async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongodb database is connected.")
    }catch(err){
        console.log(`error in connecting mongodb ${err}`)
    }
}

module.exports = connectdb