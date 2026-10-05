const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/Users.models')

//creating account and hashing password using bcrypt
module.exports.create_account=async (req,res,next)=>{
        try{
            const {name,password,email,totalsaving,role}=req.body
            
            if (!name||!password||!email){
                return res.status(400).send("Enter name email password totalsavings.")
            }
            const exist = await User.findOne({email:email})
            console.log(exist)
            if (exist){
                return res.status(409).send("User already exists.")
            }
            const hashed = await bcrypt.hash(password,10)
            const user = await User.create({
                name,password:hashed,email,totalsaving,role:role||"user"
            })
            res.status(200).json({message:"User is created",user:{id:user._id,name:name,totalSavings:user.totalsaving,email:user.email}})
        }catch(err){
            next(err)
        }
}

//getting all the users
module.exports.allUsers=async (req,res,next)=>{
    try{
        const users = await User.find().select('-password')
        res.send(users)
    }catch(err){
        next(err)
    }
}

//login 
module.exports.login=async (req,res,next)=>{
    
    res.send({message:"you are successfully logged in..",token:req.token})
}

//adding expenses updating totalsaving and pushing the expense in expenses
module.exports.addexpense=async (req,res,next)=>{
    try{
        const {amount,cause,date,description,category} = req.body
        if (!amount){
            return res.status(400).send("Enter amount cause ")
        }
        let findUser =await User.findOne({email:req.user.email})
        if (amount>findUser.totalsaving){
            return res.status(409).send(`Your totalsaving is ${findUser.totalsaving} Add more money in savings.`)
        }
        findUser.totalsaving-=amount
        //the category will be 
        if (!category){
            category="others"
        }
        findUser.expenses.push({amount:amount,cause:cause||"Not known",date:date||Date.now(),
            description:description||"Not known",category:category.toLowerCase()})
        await findUser.save()
        res.send({message:`Hey ${findUser.name} your expense is saved `,expense:findUser.expenses.at(-1)})
        }catch(err){
            next(err)
        }
    
}

//take amount to update and take expense from last expenses and update it normally 
// and then user.save()
module.exports.updateExpense =async (req,res,next)=>{
    try{
        const {id,amount,cause} = req.body
        if (!amount||!id){
            return res.status(400).send("Enter amount id cause.")
        }
        let findUser = await User.findOne({email:req.user.email})
        let expense= findUser.expenses.find(u=>u._id.toString()==id)
        if (!expense){
            return res.status(404).send(`Expense with id ${id} not found`)
        }
        if (amount>(findUser.totalsaving+expense.amount)){
            return res.status(400).send(`Your totalsaving will be only ${totalsaving+expense.amount}`)
        }
        findUser.totalsaving+=expense.amount
        findUser.totalsaving-=amount
        expense.amount=amount
        expense.cause=cause||expense.cause
        findUser.save()
        res.status(200).send({message:`Hey ${findUser.name} your expense is successfully updated `,updatedExpense:expense})
    }catch(err){
        next(err)
    }
    
}

module.exports.updateaccount=async (req,res,next)=>{
    try{
        const {name,password} = req.body
        let findUser = await User.findOne({_id:req.user.id})
        let Name=name||req.user.name
        findUser.name=Name
        if (password){
            let hashed =await bcrypt.hash(password,10)
            findUser.password=hashed
            findUser.save()
            return res.status(200).send({message:"Account updatd successfully",user:{id:findUser._id,name:findUser.name,email:findUser.email},
            IMPORTANT:"now login with another password"})
        }
        findUser.save()
        res.status(200).send({message:"Account updated successfully",user:{id:findUser._id,name:findUser.name,email:findUser.email}})
    }
        catch(err){next(err)}
    
}

module.exports.addmoney=async(req,res,next)=>{
    try{
        const money = req.body.money
        if (money<=0){
            return res.status(400).send("What rubbish are u doing you think i am fool.")
        }
        let user = await User.findOne({email:req.user.email})
        user.totalsaving+=money
        await user.save()
        res.status(200).send({message:`Hey ${user.name} your money is successfully added `,totalSaving:user.totalsaving})
    }catch(err){
        next(err)
    }
}

module.exports.wholeexpense=async(req,res,next)=>{
    try{
        const user = await User.findOne({email:req.user.email})
        const expenses = user.expenses
        let expenselst=[]
        let totalmoney=0
        expenses.forEach((el)=>{
            let temp={}
            totalmoney+=el.amount
            temp.amount=el.amount
            temp.cause=el.cause
            temp.date=String(el.date).split('T')[0]
            expenselst.push(temp)
        })
        res.status(200).send({expenseList:expenselst,totalmoneySpend:totalmoney})

        }catch(err){
            next(err)
    } 
}

module.exports.deleteExpense = async (req,res,next)=>{
    try{
        const {id} = req.body
        const user =await  User.findOne({email:req.user.email})
        let expense= user.expenses.find(u=>u._id.toString()===id)
        console.log(expense)
        let money = expense.amount
        user.totalsaving+=money
        user.expenses.pull(id)
        await user.save()
        res.status(200).send("Expense is deleted.")
    }catch(err){
        next(err)
    }
}