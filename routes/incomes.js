const fs = require('fs')
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
let categories = [
    {value:0, title:'Salary'},
    {value:1, title : 'Savings'},
    {value:2, title:'Loan'},
    {value:3, title: 'Others'}
]
router.get('/',(req,res)=>{
    const success = req.query.success || false
    res.render('allincomes', { success})
});


router.get('/new_income',(req,res)=>{
    res.render('newincome',{categories:categories})
});
router.post('/new_income',(req,res)=>{
    const formData = req.body
    Category = formData.category
    let icon = ""
            if(Category == 0){
                icon = "coins"
            }
            else if(Category == 1){
                icon = "piggy-bank"
            }
            else if (Category == 2){
                icon = "hand-holding-dollar"
            }
            else{
                icon = "circle-dollar-to-slot"
            }
        fs.readFile('./data/incomes.json',(err,data)=>{
            if(err) throw err

            const formattedDate = new Date().toLocaleDateString('en-GB')
            const income_info = JSON.parse(data)
            income_info.push({
                id:id(),
                Category: formData.category.title,
                Amount: formData.amount,
                Details: formData.Details,
                RegisterDate: formattedDate,
                Icon: icon
            })

            fs.writeFile('./data/incomes.json',JSON.stringify(income_info),err=>{
                if(err) throw err

                res.redirect('/incomes?success=true');
            })
        })
})


module.exports = router;

function id() {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
  };