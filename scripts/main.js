/**
 * @file main.js
 * @author Francesco Violante
 * 
 * Main page for the weather stations dashboard.
 */

 // TODO

 // gestione stazioni -> inserirle in un array di oggetti
 // refresh dati ogni 30 secondi 
 // settare refresh dati a N secondi (max e min)
 // collapsible

(() => {

    APP.api.getLocationWeatherInfo();
    
    APP.api.getData()
    .then((data) => {

        APP.dom.hideLoading();
        APP.dom.createTableView(data);
        APP.filters.searchFilter();
        APP.filters.countryFilter();

    })
    .catch(() => {

        APP.api.getBackupData()
        .then((data) => {
            APP.dom.createTableView(data);
        })
        .catch(error => {
            console.error(error);
        });
        
    });

})();