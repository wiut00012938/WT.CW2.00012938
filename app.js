let fs = require('fs')
const express = require('express');
const app = express();
const path = require('path');
let PORT = process.env.PORT || 5000;


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

app.get('/',(req,res)=>{
    fs.readFile('./data/account.json',(err,data)=>{
        if(err) throw err

        const accounts = JSON.parse(data)
        if(Object.keys(accounts).length == 0){
            res.render('signup.pug')
        }
        else{
            res.render('index.pug')
        }
    })
})
app.post('/sign-up',(req,res)=>{
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
})


app.listen(PORT, error => {
    if (error) throw error
    console.log(`App is available via http://localhost:${ PORT }`)
})


function id() {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
  };