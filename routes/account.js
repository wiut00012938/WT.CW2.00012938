const fs = require('fs')
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const exp = require('constants');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json())

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
        res.render('UpdateAccount', {account:account,})
    })
})
router.post('/update',
body('name')
.isLength({min:1,max:15}).withMessage('Name has to be filled and be between 1-15 characters')
.matches(/^[A-Za-z\s]+$/).withMessage('Name must be alphabetic.')
.custom(value => !/\s/.test(value)).withMessage("Enter only Name without any spacing")
,
body('surname')
.isLength({min:1,max:15}).withMessage('Surname has to be filled and be between 1-15 characters')
.matches(/^[A-Za-z\s]+$/).withMessage('Surname must be alphabetic.')
.custom(value => !/\s/.test(value)).withMessage("Enter only a Surname wihout any spacing")
,
body('email')
.isLength({min:1,max:30})
.withMessage('Email must not be empy or exceed 15 characters')
.isEmail()
.withMessage('email has to be in proper format, i.e. andrew@doe.com')
,
body('limit')
.isLength({min:1,max:15})
.withMessage('limit must to filled')
.custom(value => value != 0)
.withMessage("Expenditure can not be equal to zero"),

(req,res)=>{
    let errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }else{
        const formData = req.body
        fs.readFile('./data/account.json',(err,data)=>{
            if(err) throw err

            const account_info = JSON.parse(data)
            account_info[0].Name = formData.name
            account_info[0].Surname = formData.surname
            account_info[0].Email = formData.email
            account_info[0].Limit = formData.limit

            fs.writeFile('./data/account.json',JSON.stringify(account_info),err=>{
                if(err) throw err

                //res.redirect('/?success=true');
                res.json({ success: true });
            })
        })
    }
})

module.exports = router;