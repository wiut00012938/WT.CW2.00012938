let form = document.getElementById('form')

let NameError = get('name-error')
let SurnameError = get('surname-error')
let EmailError = get('email-error')
let LimitError = get('limit-error')

form.addEventListener('submit', e => {
    e.preventDefault()

    fetch('/sign-up',{
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            name: getValue('name'),
            surname: getValue('surname'),
            email:getValue('email'),
            limit: getValue('limit')
        })
    })
    .then(res=> res.json())
    .then(data=>{
        NameError.textContent = ''
        get('name').classList.remove('error')

        SurnameError.textContent = ''
        get('surname').classList.remove('error')

        EmailError.textContent = ''
        get('email').classList.remove('error')

        LimitError.textContent = ''
        get('limit').classList.remove('error')

        data.errors.forEach(error =>{
            get(`${error.param}-error`).textContent = `${error.msg} | you entered ${error.value ? error.value: 'nothing'}`
            get(`${error.param}`).classList.add('error')
        })
    })
})


function getValue(elemId) {
    return document.getElementById(elemId).value
}

function get(elemId) {
    return document.getElementById(elemId)
}