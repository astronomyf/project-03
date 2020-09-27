"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * @file dom.js
 * @author Francesco Violante
 * 
 * Dom module for the weather stations dashboard.
 * 
 * Functions used to manipulate the dom and display data on the page.
 */
APP.dom = function () {
  /**
   * Add a click event to the 'Map' link on the menu.
   * @param {object} stations array of stations.
   */
  var setMapLink = function setMapLink(stations) {
    var linkList = document.querySelectorAll('.menu-list li a'); // menu link

    linkList[2].addEventListener('click', function () {
      APP.utils.loadMapPage(stations, [stations[61].lat, stations[61].lon], 'all');
      fixMapView();
    });
  };
  /**
   * Make space on the container when the map has to be displayed.
   */


  var fixMapView = function fixMapView() {
    var gridContainer = document.getElementsByClassName('grid-container')[0];
    var mainContainer = document.getElementsByClassName('main')[0];
    gridContainer.setAttribute('style', 'grid-template-areas: "sidenav main" "sidenav main"');
    mainContainer.setAttribute('style', 'padding: 0px');
  };
  /**
   * Hide the loading gif.
   */


  var hideLoading = function hideLoading() {
    var loadingImage = document.getElementById('loading-img');
    loadingImage.remove();
  };
  /**
   * Get a color depending on a station temperature.
   * @param {object} station a station.
   * @returns {string} a color hex value.
   */


  var colorTemperature = function colorTemperature(station) {
    var color = '49c6ff';

    if (!station.temperature) {
      return '3238D9';
    }

    if (station.temperature > 15 && station.temperature < 25) {
      color = 'f5b13c';
    }

    if (station.temperature > 25) {
      color = 'd93232';
    }

    return color;
  };
  /**
   * Add a click event to 'Open in Map' button.
   * @param {object} station a weather station.
   * @param {object} target target element to get the button.
   * 
   * Open a map set on the clicked station's cordinates.
   */


  var openStationInMap = function openStationInMap(station, target) {
    var stationButton = target.nextElementSibling.querySelector('a');
    stationButton.addEventListener('click', function () {
      APP.utils.loadMapPage(station, [station.lat, station.lon], 'single');
      fixMapView();
    });
  };
  /**
   * Make a station's list header clickable.
   * @param {object} stations array of weather stations.
   * 
   * If the list is collapsed it will add the content of the body
   * otherwise will remove it.
   */


  var makeHeaderClickable = function makeHeaderClickable(stations) {
    var stationNames = [].slice.call(document.getElementsByClassName('station-text-city'));

    var _iterator = _createForOfIteratorHelper(stationNames),
        _step;

    try {
      var _loop = function _loop() {
        var name = _step.value;
        var header = name.parentElement;
        var pos = stations.map(function (e) {
          return e.name;
        }).indexOf(name.innerText.replace(/\s$/g, ''));
        header.addEventListener('click', function (event) {
          if (header.classList.contains('open')) {
            header.nextElementSibling.remove();
            header.classList.remove('open');
          } else {
            header.classList.add('open');
            createBodyList(stations[pos], event.currentTarget);
            openStationInMap(stations[pos], event.currentTarget);
          }
        });
      };

      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        _loop();
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  /**
   * Dynamically create the headers of the list stations.
   * @param {object} stations array of weather stations.
   */


  var createListView = function createListView(stations) {
    var listContainer = document.getElementById('main-list-container');

    var _iterator2 = _createForOfIteratorHelper(stations),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var station = _step2.value;
        var templateView = "\n            <div class=\"list-wrapper col-12\">\n                <div class=\"list-header align-items-center\">\n                    <div class=\"img-container\">\n                        <img class=\"img-rounded\" src=\"".concat(station.stationImage, "\" alt=\"Station image\"> \n                    </div>\n                    <div class=\"station-text-city\">\n                        ").concat(station.name, "\n                        <img clas=\"flag\" src=\"https://www.countryflags.io/").concat(station.nationCode, "/flat/16.png\">\n                    </div>\n                    <div class=\"station-text-region\">").concat(station.region, ", <span class=\"text-country\">").concat(station.nation, "</span></div>\n                    <div class=\"text-altitude\">Altitude</div>\n                    <div class=\"value-altitude\">").concat(station.elevation == null ? 'N.D.' : station.elevation, "m</div>\n                    <div class=\"text-temperature\">Temperature</div>\n                    <div class=\"value-temperature opacity\" style=\"color:#").concat(colorTemperature(station), "\">").concat(station.temperature == null ? 'N.D.' : station.temperature + '°C', "</div>\n                    <div class=\"text-humidity\">Humidity</div>\n                    <div class=\"value-humidity opacity\">").concat(station.humidity == null ? 'N.D.' : station.humidity + '%', "</div>\n                    <div class=\"arrow-icon\">\n                        <i class=\"material-icons md-48 icon\">keyboard_arrow_down</i>\n                    </div>\n                </div>\n            </div>");
        listContainer.insertAdjacentHTML('beforeend', templateView);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  };
  /**
   * Check if the live image from a station exist.
   * @param {object} station weather station object.
   * @returns {string} an image url.
   * 
   * If the first link is null, check the second link
   * if the second link is null, use a placeholder image instead.
   */


  var getLiveImage = function getLiveImage(station) {
    var url = station.webcamLiveUrl;

    if (!url) {
      url = station.webcamLiveUrl2;

      if (!url) {
        // use placeholder instead
        url = 'https://riabilitazionelavalle.it/wp-content/uploads/2016/10/orionthemes-placeholder-image.jpg';
      }
    }

    return url;
  };
  /**
   * Add opacity animation to an element.
   * @param {object} el a document object element.
   */


  var addAnimatedValues = function addAnimatedValues(el) {
    if (el.classList.contains('opacity')) {
      el.classList.remove('opacity');
      setTimeout(function () {
        el.classList.add('opacity');
      }, 0);
    } else {
      el.classList.add('opacity');
    }
  };
  /**
   * Create the body content of a station.
   * @param {object} station a weather station object.
   * @param {object} target a document object element.
   * 
   * When the station's list header is clicked this will be added
   * to the html.
   */


  var createBodyList = function createBodyList(station, target) {
    var bodyTemplate = "\n            <div class=\"list-body\">\n                <div class=\"list-body-general\">\n                    <div class=\"station-description\">".concat(station.description, "</div>\n                    <a class=\"btn btn-primary\">Open in map</a>\n                </div>\n                <div class=\"list-body-info\">\n                    <div class=\"max-temperature d-flex flex-row align-items-center\">\n                        <img class=\"info-icon\" src=\"resources/img/temperaturapiu.svg\">  \n                        <div class=\"info-values d-flex flex-column\">\n                            <div class=\"max-temp-value opacity\">").concat(station.maxTemp == null ? 'N.D.' : station.maxTemp + '°C', "</div>\n                            <span>Max temperature</span>\n                        </div>\n                    </div>\n                    <div class=\"min-temperature d-flex flex-row align-items-center\">\n                        <img class=\"info-icon\" src=\"resources/img/temperaturameno.svg\">\n                        <div class=\"info-values d-flex flex-column\">\n                            <div class=\"min-temp-value opacity\">").concat(station.minTemp == null ? 'N.D.' : station.minTemp + '°C', "</div>\n                            <span>Min Temperature</span>\n                        </div>\n                    </div>\n                    <div class=\"pressure d-flex flex-row align-items-center\">\n                        <img class=\"info-icon\" src=\"resources/img/umiditapiu.svg\">\n                        <div class=\"info-values d-flex flex-column\">\n                            <div class=\"max-hum-value opacity\">").concat(station.maxHum == null ? 'N.D.' : station.maxHum + '%', "</div>\n                            <span>Max Humidity</span>\n                        </div>\n                    </div>\n                    <div class=\"wind d-flex flex-row align-items-center\">\n                        <img class=\"info-icon\" src=\"resources/img/umiditameno.svg\">\n                        <div class=\"info-values d-flex flex-column\">\n                            <div class=\"min-hum-value opacity\">").concat(station.minHum == null ? 'N.D.' : station.minHum + '%', "</div>\n                            <span>Min Humidity</span>\n                        </div>\n                    </div>\n                    <div class=\"burst d-flex flex-row align-items-center\">\n                        <img class=\"info-icon\" src=\"resources/img/vento.svg\">\n                        <div class=\"info-values d-flex flex-column\">\n                            <div class=\"wind-value opacity\">").concat(station.wind == null ? 'N.D.' : station.wind + ' km/s', "</div>\n                            <span>Wind strength</span>\n                        </div>\n                    </div>\n                    <div class=\"rain d-flex flex-row align-items-center\">\n                        <img class=\"info-icon\" src=\"resources/img/pioggia.svg\">\n                        <div class=\"info-values d-flex flex-column\">\n                            <div class=\"rain-value opacity\">").concat(station.rain == null ? 'N.D.' : station.rain + ' mm', "</div>\n                            <span>Daily Rain</span>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"list-body-live\" style=\"background-image:url(").concat(getLiveImage(station), ")\"></div>\n        </div>");
    target.insertAdjacentHTML('afterend', bodyTemplate);
  };
  /**
   * Replace the content of the header values.
   * @param {object} stations array of weather stations.
   */


  var refreshHeaderView = function refreshHeaderView(stations) {
    var stationsTemperature = [].slice.call(document.getElementsByClassName('value-temperature'));
    var stationsHumidity = [].slice.call(document.getElementsByClassName('value-humidity'));
    stations.forEach(function (station, index) {
      stationsTemperature[index].style.color = colorTemperature(station);
      stationsTemperature[index].innerText = station.temperature == null ? 'N.D.' : station.temperature + '°C';
      stationsHumidity[index].innerText = station.humidity == null ? 'N.D.' : station.humidity + '°%'; // add animation

      addAnimatedValues(stationsTemperature[index]);
      addAnimatedValues(stationsHumidity[index]);
    });
  };
  /**
   * Replace the content of the list body stations values.
   * @param {object} stations array of weather stations.
   * 
   * Refresh the content only on opened lists and not hidden by the filters.
   */


  var refreshBodyView = function refreshBodyView(stations) {
    var maxTemperature = [].slice.call(document.getElementsByClassName('max-temp-value'));
    var minTemperature = [].slice.call(document.getElementsByClassName('min-temp-value'));
    var maxHumidity = [].slice.call(document.getElementsByClassName('max-hum-value'));
    var minHumidity = [].slice.call(document.getElementsByClassName('min-hum-value'));
    var windValue = [].slice.call(document.getElementsByClassName('wind-value'));
    var rainValue = [].slice.call(document.getElementsByClassName('rain-value'));
    var liveImage = [].slice.call(document.getElementsByClassName('list-body-live'));

    if (maxTemperature.length > 0) {
      maxTemperature.forEach(function (temp, index) {
        var header = temp.parentElement.parentElement.parentElement.parentElement.parentElement;
        var cityName = temp.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.nextElementSibling.innerText.replace(/\s$/, '');
        var pos = stations.map(function (e) {
          return e.name;
        }).indexOf(cityName);

        if (!header.hasAttribute('style')) {
          maxTemperature[index].innerText = stations[pos].maxTemp == null ? 'N.D.' : stations[pos].maxTemp + '°C';
          minTemperature[index].innerText = stations[pos].minTemp == null ? 'N.D' : stations[pos].minTemp + '°C';
          maxHumidity[index].innerText = stations[pos].maxHum == null ? 'N.D' : stations[pos].maxHum + '%';
          windValue[index].innerText = stations[pos].wind == null ? 'N.D' : stations[pos].wind + ' km/s';
          minHumidity[index].innerText = stations[pos].minHum == null ? 'N.D' : stations[pos].minHum + '%';
          rainValue[index].innerText = stations[pos].rain == null ? 'N.D' : stations[pos].rain + ' mm';
          liveImage[index].style.backgroundImage = "url(".concat(getLiveImage(stations[pos]), ")"); // add animation

          addAnimatedValues(maxTemperature[index]);
          addAnimatedValues(minTemperature[index]);
          addAnimatedValues(maxHumidity[index]);
          addAnimatedValues(minHumidity[index]);
          addAnimatedValues(windValue[index]);
          addAnimatedValues(rainValue[index]);
          addAnimatedValues(liveImage[index]);
        }
      });
    }
  };
  /**
   * Populates the content of the sidenav weather card.
   * @param {object} data a resolved promise object.
   */


  var populateWeatherCard = function populateWeatherCard(data) {
    var actualDate = new Date();
    var city = document.getElementsByClassName('locationCity')[0];
    var weather = document.getElementsByClassName('locationRegion')[0];
    var weatherIcon = document.getElementsByClassName('weather-icon')[0];
    var time = document.getElementsByClassName('card-title')[0];
    var weekDate = document.getElementsByClassName('date')[0];
    var temperature = document.getElementsByClassName('weather-temperature-value')[0];
    var humidityValue = document.getElementsByClassName('humidity-value')[0];
    var humidityBar = document.getElementsByClassName('humidity-bar')[0];
    var precipValue = document.getElementsByClassName('precip-value')[0];
    var precipBar = document.getElementsByClassName('precip-bar')[0];
    city.innerText = data.name;
    weather.innerText = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
    weatherIcon.innerHTML = "<img src=\"http://openweathermap.org/img/wn/".concat(data.weather[0].icon, "@2x.png\">");
    time.innerText = actualDate.getHours() + ':' + actualDate.getMinutes();
    weekDate.innerText = actualDate.toDateString();
    temperature.innerText = data.main.temp.toFixed(1);
    humidityValue.innerText = data.main.humidity + '%';
    precipValue.innerText = data.clouds.all + '%';
    humidityBar.style.width = data.main.humidity + '%';
    precipBar.style.width = data.clouds.all + '%';
  };
  /**
   * Display the the weather card.
   * 
   * To be called after the api call is resolved.
   */


  var showWeatherCard = function showWeatherCard() {
    var weatherCard = document.getElementById('weather-card');
    weatherCard.classList.add('animate-card');
  };
  /**
   * Show/hide the mobile menu when the user click on 
   * the hamburger icon.
   */


  var toggleMenu = function toggleMenu() {
    var menuIcon = document.getElementById("nav-menu");
    menuIcon.addEventListener('click', function () {
      var mobileMenu = document.getElementById("mobile-menu");

      if (mobileMenu.hasAttribute('style')) {
        mobileMenu.removeAttribute('style');
      } else {
        mobileMenu.setAttribute('style', 'display:block!important');
      }
    }, false);
  };
  /**
   * Add an error message at the top of the main content.
   * @param {string} errorType a string error.
   * 
   * Used to display data error or warning.
   */


  var showDataError = function showDataError(errorType) {
    var listContainer = document.getElementById('main-list-container');
    var warningTemplate;

    if (errorType == 'warning') {
      warningTemplate = "<div class=\"alert alert-warning\" role=\"alert\">\n            Real time data is not responding. You're viewing backup data.\n            </div>";
    } else {
      warningTemplate = "<div class=\"alert alert-danger\" role=\"alert\">\n            Real time data and backup data is not responding. Please try again later.\n            </div>";
    }

    listContainer.insertAdjacentHTML('beforeend', warningTemplate);
  };
  /**
   * Calls the refresh functions and makes possibile to play and pause.
   * @param {number} id id of a setInterval.   
   * @param {number} interval interval in seconds.
   */


  var refreshButton = function refreshButton(id, interval) {
    var pauseButton = document.getElementById('pause-btn');
    pauseButton.addEventListener('click', function () {
      if (pauseButton.innerText == 'pause') {
        pauseButton.innerText = 'play_arrow';
        APP.utils.pauseRefresh(id);
      } else {
        pauseButton.innerText = 'pause';
        APP.utils.runRefresh(interval);
      }
    });
  };
  /**
   * Insert the last refresh time on the page.
   * @param {object} time a date object.
   */


  var addRefreshTime = function addRefreshTime(time) {
    var timeContainer = document.querySelector('.info-container > span');
    timeContainer.innerText = time.toLocaleTimeString('it-IT');
  };

  return {
    createListView: createListView,
    createBodyList: createBodyList,
    makeHeaderClickable: makeHeaderClickable,
    refreshHeaderView: refreshHeaderView,
    hideLoading: hideLoading,
    populateWeatherCard: populateWeatherCard,
    showWeatherCard: showWeatherCard,
    setMapLink: setMapLink,
    showDataError: showDataError,
    addRefreshTime: addRefreshTime,
    refreshButton: refreshButton,
    refreshBodyView: refreshBodyView,
    toggleMenu: toggleMenu
  };
}();