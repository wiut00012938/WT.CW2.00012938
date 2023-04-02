let form = document.getElementById('form')
let Id = get('id').textContent
let AmountError = get('amount-error')
console.log(Id)

form.addEventListener('submit', e => {
    e.preventDefault()

    fetch(`/incomes/${Id}/update`,{
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            id: get('id').textContent,
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
        window.location.href = '/incomes?updated=true';
    }
    })
})

function getValue(elemId) {
    return document.getElementById(elemId).value
}

function get(elemId) {
    return document.getElementById(elemId)
}