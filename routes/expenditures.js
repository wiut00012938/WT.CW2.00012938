const express = require('express');
const router = express.Router();

let categories = [
    {value:0, title:'Hygiene'},
    {value:1, title : 'Food'},
    {value:2, title:'For Home'},
    {value:3, title:'Health'},
    {value:4, title:'Cafee/Restaurant'},
    {value:5, title:'Car'},
    {value:6, title:'Clothes'},
    {value:7, title:'Pets'},
    {value:8, title:'Gifs'},
    {value:9, title:'Hobbies'},
    {value:10, title:'Transport'},
    {value:11, title:'Bills'},
    {value:12, title:'Others'},
]

router.get('/',(req,res)=>{
    res.send('<h1>This is all the posts!</h1>');
});
router.get('/new_expenditure',(req,res)=>{
    res.render('newexpense', {categories: categories})
})
module.exports = router;