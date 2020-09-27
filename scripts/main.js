/**
 * @file main.js
 * @author Francesco Violante
 * 
 * Main page for the weather stations dashboard.
 */

(() => {

    let time = new Date();
    let refreshTime = 1000;

    APP.dom.addRefreshTime(time);

    APP.api.getLocationWeatherInfo();
    
    APP.api.getData()
    .then((data) => {

        if(data) {
            APP.dom.hideLoading();
        }

        APP.utils.createView(data);
        let intervalId = APP.utils.runRefresh(refreshTime);
        APP.dom.refreshButton(intervalId, refreshTime);

        APP.dom.setMenuLinks(data);

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