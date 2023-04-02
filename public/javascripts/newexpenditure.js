let form = document.getElementById('form')

let AmountError = get('amount-error')
console.log("does it work?")

form.addEventListener('submit', e => {
    e.preventDefault()

    fetch('/expenditures/new_expenditure',{
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            amount: getValue('amount'),
            category: getValue('category'),
            details: getValue('details'),
        })
    })
    .then(res=> res.json())
    .then(data=>{
        AmountError.textContent = ''
        get('amount').classList.remove('error')
        if(data.errors != null){
            data.errors.forEach(error =>{
                get(`${error.param}-error`).textContent = `${error.msg} | you entered ${error.value ? error.value: 'nothing'}`
                get(`${error.param}`).classList.add('error')
        })
    }
    else{
        window.location.href = '/expenditures?sucess=true';
    }
    })
})

function getValue(elemId) {
    return document.getElementById(elemId).value
}

function get(elemId) {
    return document.getElementById(elemId)
}