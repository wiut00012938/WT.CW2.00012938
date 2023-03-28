const fs = require('fs')
const express = require('express');
const router = express.Router();
const app = express()
app.use(express.urlencoded({extended: false}))
router.get('/',(req,res)=>{
    fs.readFile('./data/account.json',(err,data)=>{
        if(err) throw err

        const account = JSON.parse(data)[0]
        const success = req.query.success || false
        res.render('account', { success,account:account})
    })
});
router.get('/update',(req,res)=>{
    fs.readFile('./data/account.json',(err,data)=>{
        if(err) throw err
        const accounts = JSON.parse(data)
        const account = accounts[0]
        res.render('UpdateAccount', {account:account})
    })
})

module.exports = router;