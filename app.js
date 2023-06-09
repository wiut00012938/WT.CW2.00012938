let fs = require('fs')
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
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
//app.use(express.urlencoded({extended: false}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.get('/',(req,res)=>{
    fs.readFile('./data/account.json',(err,data)=>{
        if(err) throw err

        const accounts = JSON.parse(data)
        const account = accounts[0]
        if(Object.keys(accounts).length == 0){
            res.render('signup.pug',{})
        }
        else{
            fs.readFile('./data/expenditures.json',(err,data)=>{
                if(err) throw err
                const expenditures = JSON.parse(data)

                const dateTotals = {};
                for (const item of expenditures) {
                const dateParts = item.RegisterDate.split('/');
                const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]); // year, month (0-indexed), day
                const dateString = date.toISOString().substring(0, 10);
                if (dateString in dateTotals) {
                    dateTotals[dateString] += parseInt(item.Amount);
                } else {
                    dateTotals[dateString] = parseInt(item.Amount);
                }
                }
                const today = new Date();
                const last7Days = [];
                for (let i = 1; i < 8; i++) { // start from yesterday's date
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                const dateString = date.toISOString().substring(0, 10);
                last7Days.push(dateString);
                }
                last7Days.reverse();

                const totalAmounts = [];
                for (const day of last7Days) {
                if (day in dateTotals) {
                    totalAmounts.push(dateTotals[day]);
                } else {
                    totalAmounts.push(0);
                }
                }



                let lastExpenditure = null
                if(Object.keys(expenditures).length == 0){
                    lastExpenditure = expenditures
                }
                else{
                    lastExpenditure = expenditures[Object.keys(expenditures).length -1]
                }
                fs.readFile('./data/incomes.json',(err,data)=>{
                    if(err) throw err
                    const incomes = JSON.parse(data)
                    let lastIncome = null
                    if(Object.keys(incomes).length == 0){
                        lastIncome = incomes
                    }
                    else{
                        lastIncome = incomes[Object.keys(incomes).length -1]
                    }
                    fs.readFile('./data/balance.json',(err,data)=>{
                        if(err) throw err
                        balance_value = JSON.parse(data)[0]
                        res.render('index',{account:account,expenditures:expenditures,lastExpenditure:lastExpenditure,lastIncome:lastIncome,incomes:incomes,balance:balance_value,last7Days: last7Days,totalAmounts:totalAmounts})
                    })
                })
            })
        }
    })
})
app.post('/sign-up',
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
.withMessage("Expenditure can not be equal to zero")
,

(req,res)=>{
    let errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }else{
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

                res.json({ success: true });
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