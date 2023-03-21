let fs = require('fs')
const express = require('express');
const app = express();
const path = require('path');
let PORT = process.env.PORT || 5000;
/*const users = require('./routes/expenditures');
const posts = require('./routes/incomes');*/

app.set('view engine','pug');
app.set('views',path.join(__dirname, 'views'));

app.use('/static', express.static(path.join(__dirname,'public')));
/*app.use('/expenditures',users);
app.use('/incomes',posts);*/
app.use(express.urlencoded({extended: false}))

app.get('/',(req,res)=>{
    res.render('index')
})
app.listen(PORT, error => {
    if (error) throw error
    console.log(`App is available via http://localhost:${ PORT }`)
})