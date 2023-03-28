const fs = require('fs')
const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    fs.readFile('./data/account.json',(err,data)=>{
        if(err) throw err

        const account = JSON.parse(data)
        const success = req.query.success || false
        res.render('account', { success,account:account})
    })
});

module.exports = router;