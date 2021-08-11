// ! globally defined country and region
let region;
let country = '';


const dropdown = document.querySelectorAll('#dropdown1 a');

dropdown.forEach(item => {
    item.addEventListener('click', () => {
        if(item.classList.contains('region-link')){
            region = true;
            country = false;        
        } else {
            region = false;
            country = item.innerText.toLowerCase()
        }
    })
    
})