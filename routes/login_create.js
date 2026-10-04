const express = require('express')
const router = express.Router()
const {create_account,allUsers,login,addexpense,updateExpense,updateaccount,addmoney,wholeexpense,deleteExpense}=require('../controller/routes_codes')
const {auth,autherize}=require('../middlewares/auth')

router.post('/create_account',create_account)
router.get('/allUsers',allUsers)
router.post('/login',auth,login)

router.use(autherize)
router.post('/addexpense',addexpense)
router.post('/updateexpense',updateExpense)
router.post('/updateaccount',updateaccount)
router.post('/addmoney',addmoney)
router.post('/deleteexpense',deleteExpense)

router.get('/wholeExpenses',wholeexpense)

module.exports = router