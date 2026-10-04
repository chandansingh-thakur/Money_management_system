const errorhandler=(err,req,res,next)=>{
    res.status(500).send(`Internal Server error `)
}

module.exports = errorhandler