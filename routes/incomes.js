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
    fs.readFile('./data/incomes.json',(err,data)=>{
        if(err) throw err

        const incomes = JSON.parse(data)
        const success = req.query.success || false
        fs.readFile('./data/balance.json',(err,data)=>{
            if(err) throw err
            balance_value = JSON.parse(data)[0]
            res.render('allincomes',{success,incomes:incomes,balance_value:balance_value})
        })
    })
});


router.get('/new_income',(req,res)=>{
    res.render('newincome',{categories:categories})
});
router.post('/new_income',(req,res)=>{
    const formData = req.body
    Category = formData.category
    let icon = ""
    let title = ""
    if(Category == 0){
        icon = "coins"
        title = "Salary"
    }
    else if(Category == 1){
        icon = "piggy-bank"
        title = "Savings"
    }
    else if (Category == 2){
        icon = "hand-holding-dollar"
        title = "Loan"
    }
    else{
        icon = "circle-dollar-to-slot"
        title = "Other Income"
    }

    fs.readFile('./data/balance.json',(err,data)=>{
        if(err) throw err
        const balance_value = JSON.parse(data)
        balance_value[0].Balance = parseFloat(balance_value[0].Balance) + parseFloat(formData.amount)
        //balance_value.Balance = new_value.toString()
        const updatedData = JSON.stringify(balance_value);
        fs.writeFileSync('./data/balance.json',updatedData);
    })


    fs.readFile('./data/incomes.json',(err,data)=>{
        if(err) throw err

        const formattedDate = new Date().toLocaleDateString('en-GB')
        const income_info = JSON.parse(data)
        income_info.push({
            id:id(),
            Category: title,
            Amount: formData.amount,
            Details: formData.details,
            RegisterDate: formattedDate,
            Icon: icon
        })

        fs.writeFile('./data/incomes.json',JSON.stringify(income_info),err=>{
            if(err) throw err

            res.redirect('/incomes?success=true');
        })
    })
})

router.get('/:id/delete',(req,res)=>{
    const id = req.params.id
    fs.readFile('./data/incomes.json',(err,data)=>{
        if(err) throw err
    
        const incomes = JSON.parse(data)
        const filteredIncomes = incomes.filter(expenditure => expenditure.id != id)
        const exactIncome = incomes.filter(expenditure=> expenditure.id === id)[0]

        fs.writeFile('./data/incomes.json',JSON.stringify(filteredIncomes), (err) =>{
            if(err) throw err
        })
        fs.readFile('./data/balance.json',(err,data)=>{let icon = ""
        let title = ""
        if(Category == 0){
            icon = "coins"
            title = "Salary"
        }
        else if(Category == 1){
            icon = "piggy-bank"
            title = "Savings"
        }
        else if (Category == 2){
            icon = "hand-holding-dollar"
            title = "Loan"
        }
        else{
            icon = "circle-dollar-to-slot"
            title = "Other Income"
        }
            if(err) throw err
            const balance_value = JSON.parse(data)
            balance_value[0].Balance = parseFloat(balance_value[0].Balance) - parseFloat(exactIncome.Amount)
            if(balance_value[0].Balance < 0){
                balance_value[0].Balance = 0
            }
            const updatedData = JSON.stringify(balance_value)
            const result = balance_value[0]
            fs.writeFile('./data/balance.json',updatedData, (err)=>{
                if(err) throw err
                res.render('allincomes',{incomes:filteredIncomes,deleted:true,balance_value:result})
            })
        })
    })
})

router.get('/:id/update',(req,res)=>{
    const id = req.params.id
    fs.readFile('./data/incomes.json',(err,data)=>{
        if(err) throw err
        const incomes = JSON.parse(data)
        const filteredIncomes = incomes.filter(expenditure => expenditure.id === id)[0]
        res.render('UpdateIncome',{incomes:filteredIncomes,id:id,categories:categories})
    })
})

router.post('/:id/update',(req,res)=>{
    const formData = req.body
    const id = req.params.id
    Category = formData.category
    let icon = ""
    let title = ""
    if(Category == 0){
        icon = "coins"
        title = "Salary"
    }
    else if(Category == 1){
        icon = "piggy-bank"
        title = "Savings"
    }
    else if (Category == 2){
        icon = "hand-holding-dollar"
        title = "Loan"
    }
    else{
        icon = "circle-dollar-to-slot"
        title = "Other Income"
    }
    fs.readFile('./data/incomes.json',(err,data)=>{
        if(err) throw err
        const income_info = JSON.parse(data)
        const index = income_info.findIndex((item) => item.id === id);
        const previous_amount = income_info[index].Amount
        income_info[index].Category = title
        income_info[index].Amount = formData.amount
        income_info[index].Details = formData.details
        income_info[index].Icon = icon
        fs.writeFile('./data/incomes.json',JSON.stringify(income_info), (err)=>{
            if(err) throw err
        })
        fs.readFile('./data/balance.json',(err,data)=>{
            if(err) throw err
            const balance_value = JSON.parse(data)
            const filteredIncomes = income_info.filter(income => income.id === id)[0]
            balance_value[0].Balance = parseFloat(balance_value[0].Balance) - parseFloat(previous_amount) + parseFloat(filteredIncomes.Amount)
            if(balance_value[0].Balance < 0){
                balance_value[0].Balance = 0
            }
            const result = balance_value[0]
            const updatedData = JSON.stringify(balance_value)
            fs.writeFile('./data/balance.json',updatedData, (err)=>{
                if(err) throw err
                res.render('allincomes',{incomes:income_info,updated:true,balance_value:result})
            })
        })
    })
})

module.exports = router;

function id() {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
  };