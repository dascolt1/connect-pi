const searchForm = document.querySelector('form')
const search = document.querySelector('input')
const name = document.querySelector("#name")
const email = document.querySelector("#email")

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let query = search.value
    const baseUrl = 'http://localhost:3000/brothers'
    
    if(window.location.search) {
        window.location.href = baseUrl
    }

    window.location.href = `${baseUrl}?name=${query}`
})