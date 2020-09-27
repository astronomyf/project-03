"use strict";

/**
 * @file main.js
 * @author Francesco Violante
 * 
 * Main page for the weather stations dashboard.
 */
(function () {
  var time = new Date();
  var refreshTime = 30; // add mobile menu

  APP.dom.toggleMenu(); // add last refresh time

  APP.dom.addRefreshTime(time); // display weather card based on user location

  APP.api.getLocationWeatherInfo(); // main api endpoint call

  APP.api.getData().then(function (data) {
    APP.utils.createView(data, refreshTime);
  })["catch"](function () {
    // if primary api fails, use the backup data
    APP.api.getBackupData().then(function (data) {
      APP.dom.showDataError('warning');
      APP.utils.createView(data, refreshTime);
    })["catch"](function (error) {
      // if second api call fails, show the user an error message
      console.error(error);
      APP.dom.showDataError('danger');
    });
  });
})();