let country_company_pages = [],
    countryRaw = window.location.href.split('_')[1];
    country = countryRaw.substr(0, countryRaw.length - 1),
    pages_elem = $('.mt0.mb0-5.pt0').find('a').not('.active');

pages_elem.each((index, elem) => {
    country_company_pages.push({
        country: country,
        page: $(elem).attr('href')
    })
})

Promise.all(country_company_pages.map(country_pages => {
    return $.get(country_pages.page)
        .done(data => {
            console.log(data);
            return data;
        })
}))
    .then(datas => {
        datas.forEach(data => {
            let companies_det = $('.bg-eso-lightblue h2.mb0');
            console.log(companies_det);
        })
    })
    .catch(err => {
        console.log(err.message);
    })
// $.post('https://iapac-dashboard.herokuapp.com/getsite', country_company_pages, (data) => {
//     console.log(data);
//
// })

//console.log(country_company_pages);