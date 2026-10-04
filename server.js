const express = require("express")
require("dotenv").config();
const connectDB = require('./db/db')
const login_create = require('./routes/login_create')
const errorhandler = require('./errorhandler')

const app = express()
app.use(express.json())
connectDB()

app.use('/',login_create)

app.use(errorhandler)
app.listen(process.env.PORT,console.log(`Server is running at ${process.env.PORT}`))
