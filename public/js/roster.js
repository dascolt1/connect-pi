const searchForm = document.querySelector('form')
const search = document.querySelector('input')
let skip = 0;
let limit = 1;

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let query = search.value
    const baseUrl = 'https://connect-pi.herokuapp.com/brothers'
    
    if(window.location.search) {
        window.location.href = baseUrl
    }

    window.location.href = `${baseUrl}?name=${query}`
})