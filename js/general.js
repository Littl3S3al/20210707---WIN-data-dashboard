const fullData_link = document.querySelector('#dash-link-1');
const articles_link = document.querySelector('#dash-link-2'); 
const PDF_link = document.querySelector('#dash-link-3'); 

fullData_link.addEventListener('click', e => {
    document.location.href = '../pages/full-data.html'
})
articles_link.addEventListener('click', e => {
    document.location.href = '../pages/articles.html'
})
PDF_link.addEventListener('click', e => {
    document.location.href = '../pages/reports.html'
})