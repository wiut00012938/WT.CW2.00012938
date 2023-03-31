const fs = require('fs')
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
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
    const success = req.query.success || false
    res.render('allexpenditures',{success})
});

router.get('/new_expenditure',(req,res)=>{
    res.render('newexpense', {categories: categories})
})

router.post('/new_expenditure',(req,res)=>{
    const formData = req.body
    Category = formData.category
    let icon = ""
    let title = ""
    if(Category == 0){
        icon = "pump-soap"
        title = 'Hygiene'
    }
    else if(Category == 1){
        icon = "utensils"
        title = 'Food'
    }
    else if (Category == 2){
        icon = "house"
        title = 'For Home'
    }
    else if (Category == 3){
        icon = "notes-medical"
        title = 'Health'
    }
    else if (Category == 4){
        icon = "mag-saucer"
        title = 'Cafee/Restaurant'
    }
    else if (Category == 5){
        icon = "car"
        title = 'Car'
    }
    else if (Category == 6){
        icon = "shirt"
        title = 'Clothes'
    }
    else if (Category == 7){
        icon = "dog"
        title = 'Pets'
    }
    else if (Category == 8){
        icon = "gift"
        title = 'Gifs'
    }
    else if (Category == 9){
        icon = "person-biking"
        title = 'Hobbies'
    }
    else if (Category == 10){
        icon = "bus"
        title = 'Transport'
    }
    else if (Category == 11){
        icon = "file-invoice-dollar"
        title = 'Bills'
    }
    else{
        icon = "box-open"
        title = 'Other expenditure'
    }

    fs.readFile('./data/balance.json',(err,data)=>{
        if(err) throw err
        const balance_value = JSON.parse(data)
        if(parseFloat(balance_value[0].Balance) - parseFloat(formData.amount) < 0){
            res.render('newexpense',{error:true,categories: categories})
        }
        else{
            balance_value[0].Balance = parseFloat(balance_value[0].Balance) - parseFloat(formData.amount)
            const updatedData = JSON.stringify(balance_value);
            fs.writeFileSync('./data/balance.json',updatedData);


            fs.readFile('./data/expenditures.json',(err,data)=>{
                if(err) throw err
        
                const formattedDate = new Date().toLocaleDateString('en-GB')
                const expense_info = JSON.parse(data)
                expense_info.push({
                    id:id(),
                    Category: title,
                    Amount: formData.amount,
                    Details: formData.details,
                    RegisterDate: formattedDate,
                    Icon: icon
                })
        
                fs.writeFile('./data/expenditures.json',JSON.stringify(expense_info),err=>{
                    if(err) throw err
        
                    res.redirect('/expenditures?success=true');
                })
            })
        }
    })
})

function id() {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
  };

module.exports = router;