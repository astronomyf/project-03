/**
 * @file main.js
 * @author Francesco Violante
 * 
 * Main page for the weather stations dashboard.
 */

(() => {

    // iifee for calling the other functions
    // main js file
    APP.api.getData()
    .then((data) => {

        APP.dom.createTableView(data);
        
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