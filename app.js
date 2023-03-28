let fs = require('fs')
const express = require('express');
const app = express();
const path = require('path');
let PORT = process.env.PORT || 5000;
const { body, validationResult } = require('express-validator');

const expenditures = require('./routes/expenditures');
const incomes = require('./routes/incomes');
const account = require('./routes/account')

app.set('view engine','pug');
app.set('views',path.join(__dirname, 'views'));

app.use('/static', express.static(path.join(__dirname,'public')));
app.use('/expenditures',expenditures);
app.use('/incomes',incomes);
app.use('/account',account)
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.get('/',(req,res)=>{
    fs.readFile('./data/account.json',(err,data)=>{
        if(err) throw err

        const accounts = JSON.parse(data)
        if(Object.keys(accounts).length == 0){
            res.render('signup.pug',{})
        }
        else{
            res.render('index.pug')
        }
    })
})
app.post('/sign-up',
body('name')
.isLength({min:1,max:15}).withMessage('Name has to be filled and be between 1-15 characters')
/*.matches(/^[A-Za-z\s]+$/).withMessage('Name must be alphabetic.')*/
,
body('surname')
.isLength({min:1,max:15}).withMessage('Surname has to be filled and be between 1-15 characters')
/*.matches(/^[A-Za-z\s]+$/).withMessage('Surname must be alphabetic.')*/
,
body('email')
.isLength({min:1,max:30})
.withMessage('Email must not be empy or exceed 15 characters')
.isEmail()
.withMessage('email has to be in proper format, i.e. andrew@doe.com')
,
body('limit')
.isLength({min:1,max:15})
.withMessage('limit must to filled'),

(req,res)=>{
    let errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }else{
        //res.json({status:'OK'})
        const formData = req.body
        fs.readFile('./data/account.json',(err,data)=>{
            if(err) throw err

            const formattedDate = new Date().toLocaleDateString('en-GB')
            const account_info = JSON.parse(data)
            account_info.push({
                id:id(),
                Name: formData.name,
                Surname: formData.surname,
                Email: formData.email,
                Limit: formData.limit,
                RegisterDate: formattedDate
            })

            fs.writeFile('./data/account.json',JSON.stringify(account_info),err=>{
                if(err) throw err

                res.redirect('/account?success=true');
            })
        })
    }
})


app.listen(PORT, error => {
    if (error) throw error
    console.log(`App is available via http://localhost:${ PORT }`)
})


function id() {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
  };