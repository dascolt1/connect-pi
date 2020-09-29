const searchForm = document.querySelector('form')
const search = document.querySelector('input')
const 
let skip = 0;
let limit = 1;

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let query = search.value
    const baseUrl = 'http://localhost:3000/brothers'
    
    if(window.location.search) {
        window.location.href = baseUrl
    }

    window.location.href = `${baseUrl}?name=${query}`
})