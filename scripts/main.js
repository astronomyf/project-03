/**
 * @file main.js
 * @author Francesco Violante
 * 
 * Main page for the weather stations dashboard.
 */

 // TODO
 // refresh dati ogni 30 secondi (mancano i dati del body)
 // settare refresh dati a N secondi (max e min)
 // collapsible

(() => {

    let time = new Date();
    let refreshTime = 10;

    APP.dom.addRefreshTime(time);

    APP.dom.setMenuLinks();
    APP.api.getLocationWeatherInfo();
    
    APP.api.getData()
    .then((data) => {

        if(data) {
            APP.dom.hideLoading();
        }

        APP.utils.createView(data);
        let intervalId = APP.utils.runRefresh(refreshTime);
        APP.dom.refreshButton(intervalId, refreshTime);

    })
    .catch(() => {

        APP.api.getBackupData()
        .then((data) => {

            if(data) {
                APP.dom.hideLoading();
            }

            APP.dom.showDataError('warning');

            APP.utils.createView(data);
            let intervalId = APP.utils.runRefresh(refreshTime);
            APP.dom.refreshButton(intervalId, refreshTime);

        })
        .catch(error => {
            console.error(error);
            
            APP.dom.showDataError('danger');
        });
        
    });

})();