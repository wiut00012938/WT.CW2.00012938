const fs = require('fs')
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const { fileURLToPath } = require('url');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json())

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
    fs.readFile('./data/expenditures.json',(err,data)=>{
        if(err) throw err

        const expenditures = JSON.parse(data)
        const success = Boolean(req.query.success);
        const updated = Boolean(req.query.updated);
        fs.readFile('./data/balance.json',(err,data)=>{
            if(err) throw err
            balance_value = JSON.parse(data)[0]
            res.render('allexpenditures',{success,updated,expenditures:expenditures,balance_value:balance_value})
        })
    })
});

router.get('/new_expenditure',(req,res)=>{
    res.render('newexpense', {categories: categories,})
})

router.post('/new_expenditure',
body('amount')
.isLength({min:1,max:15})
.withMessage('Amout must to be filled')
.custom(value => value != 0)
.withMessage("Expenditure can not be equal to zero"),
(req,res)=>{
    let errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }else{
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
            
                        if (req.query.success === 'true') {
                            res.json({ success: true });
                          } else {
                            res.json({ success: false });
                          }
                    })
                })
            }
        })
    }
})


router.get('/:id/delete',(req,res)=>{
    const id = req.params.id
    fs.readFile('./data/expenditures.json',(err,data)=>{
        if(err) throw err
    
        const expenditures = JSON.parse(data)
        const filteredExpenditures = expenditures.filter(expenditure => expenditure.id != id)
        const exactExpenditure = expenditures.filter(expenditure=> expenditure.id === id)[0]

        fs.writeFile('./data/expenditures.json',JSON.stringify(filteredExpenditures), (err) =>{
            if(err) throw err
        })
        fs.readFile('./data/balance.json',(err,data)=>{
            if(err) throw err
            const balance_value = JSON.parse(data)
            balance_value[0].Balance = parseFloat(balance_value[0].Balance) + parseFloat(exactExpenditure.Amount)
            const updatedData = JSON.stringify(balance_value)
            const result = balance_value[0]
            fs.writeFile('./data/balance.json',updatedData, (err)=>{
                if(err) throw err
                res.render('allexpenditures',{expenditures:filteredExpenditures,deleted:true,balance_value:result})
            })
        })
    })
})

router.get('/:id/update',(req,res)=>{
    const id = req.params.id
    fs.readFile('./data/expenditures.json',(err,data)=>{
        const expenditures = JSON.parse(data)
        const filteredExpenditures = expenditures.filter(expenditure => expenditure.id === id)[0]
        res.render('UpdateExpense',{expenditures:filteredExpenditures,id:id,categories:categories,})
    })
})
router.post('/:id/update',
body('amount')
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
        const id = req.params.id
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
        fs.readFile('./data/expenditures.json',(err,data)=>{
            if(err) throw err
            const expense_info = JSON.parse(data)
            const index = expense_info.findIndex((item) => item.id === id);
            console.log(index)
            console.log(expense_info[index].Amount)
            const previous_amount = expense_info[index].Amount
            expense_info[index].Category = title
            expense_info[index].Amount = formData.amount
            expense_info[index].Details = formData.details
            expense_info[index].Icon = icon
            fs.writeFile('./data/expenditures.json',JSON.stringify(expense_info), (err)=>{
                if(err) throw err
            })
            fs.readFile('./data/balance.json',(err,data)=>{
                if(err) throw err
                const balance_value = JSON.parse(data)
                const filteredExpenditures = expense_info.filter(expenditure => expenditure.id === id)[0]
                balance_value[0].Balance = parseFloat(balance_value[0].Balance) + parseFloat(previous_amount) - filteredExpenditures.Amount
                if(balance_value[0].Balance < 0){
                    balance_value[0].Balance = 0
                }
                const updatedData = JSON.stringify(balance_value)
                fs.writeFile('./data/balance.json',updatedData, (err)=>{
                    if(err) throw err
                    if (req.query.updated === 'true') {
                        res.json({ updated: true });
                      } else {
                        res.json({ updated: false });
                      }
                })
            })
        })
    }
})


function id() {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
  };  

module.exports = router;