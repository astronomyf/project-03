/**
 * @file main.js
 * @author Francesco Violante
 * 
 * Main page for the weather stations dashboard.
 */

(() => {

    let time = new Date();
    let refreshTime = 30;

    // add mobile menu
    APP.dom.toggleMenu();

    // add last refresh time
    APP.dom.addRefreshTime(time);

    // display weather card based on user location
    APP.api.getLocationWeatherInfo();
    
    // main api endpoint call
    APP.api.getData()
    .then((data) => {

        APP.utils.createView(data, refreshTime);
    })
    .catch(() => {

        // if primary api fails, use the backup data
        APP.api.getBackupData()
        .then((data) => {

            APP.dom.showDataError('warning');
            APP.utils.createView(data, refreshTime);

        })
        .catch(error => {

            // if second api call fails, show the user an error message
            console.error(error);
            
            APP.dom.showDataError('danger');
        });
    });

})();