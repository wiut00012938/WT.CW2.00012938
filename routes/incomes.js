const express = require('express');
const router = express.Router();
let categories = [
    {value:0, title:'Salary'},
    {value:1, title : 'Savings'},
    {value:2, title:'Loan'},
    {value:3, title: 'Others'}
]
router.get('/',(req,res)=>{
    res.send('<h1>This is all the posts!</h1>');
});
router.get('/new_income',(req,res)=>{
    res.render('newincome',{categories:categories})
});

module.exports = router;