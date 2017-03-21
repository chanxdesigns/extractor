/***
 * Esomar Extractor
 * By Chanx Singha <chanx.designs@gmail.com>
 */

// Notify User Silently
console.log("Extraction Started");

/**
 * Extract Country Pages
 * @type {Array}
 */
let country_company_pages = [],
    countryRaw = window.location.href.split('_')[1];
    country = countryRaw.substr(0, countryRaw.length - 1),
    pages_elem = $('.mt0.mb0-5.pt0').find('a').not('.active');

pages_elem.each((index, elem) => {
    country_company_pages.push({
        page: $(elem).attr('href')
    })
})

/**
 * Extract Everything
 */
Promise.all(country_company_pages.map(country_pages => {
    return $.get(country_pages.page)
        .done(data => data)
        .fail(err => err.message);
}))
    .then(datas => {
        // Get Company Esomar URL
        let companies = [];
        datas.forEach(data => {
            let companies_det = $(data).find('.bg-eso-lightblue h2.mb0');
            for (var i = 0; i < companies_det.length; i++) {
                companies.push({
                    company_name: $(companies_det[i]).find('a').first().text().trim(),
                    company_esomar_url: $(companies_det[i]).find('a').first().attr('href')
                });
            }
        });
        return companies;
    })
    .then(companies => {
        // Get Company URL
        Promise.all(companies.map(company => {
            return $.when($.get(company.company_esomar_url))
                .then(
                    data => {
                    return {
                            directory: 'Esomar',
                            country: country,
                            company_name: company.company_name,
                            company_url: $(data).find('a[data-ga-category="website"]').attr('href') != undefined ? $(data).find('a[data-ga-category="website"]').attr('href') : '404'
                        }
                },
                    err => err.message
                )
        }))
            .then(companies_data => {
                // Post Datas to Database
                $.post('https://mrscraper.herokuapp.com/companies/submit', {data: JSON.stringify(companies_data)})
                    .done(() => {
                        window.alert("Completed Storing Of " + country + " Companies");
                    })
                    .fail(() => {
                        window.alert("Something Nasty Happened")
                    })
            });
    })
    .catch(err => err.message);