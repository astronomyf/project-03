"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * @file utils.js
 * @author Francesco Violante
 * 
 * Utils module for the weather stations dashboard.
 * 
 * Utility functions used in other modules.
 */
APP.utils = function () {
  /**
   * Fetch a local html page.
   * @param {string} page an html page that exists on the website.
   * @returns {object}
   */
  var fetchDynamicPage = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(page) {
      var response;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return fetch(page);

            case 2:
              response = _context.sent;
              _context.next = 5;
              return response.text();

            case 5:
              return _context.abrupt("return", _context.sent);

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function fetchDynamicPage(_x) {
      return _ref.apply(this, arguments);
    };
  }();
  /**
   * Load the map page.
   * @param {object} stations array of weather stations.
   * @param {object} coords array of coordinates.
   * @param {string} options 'all' (to display every station) | 'single' to display one station.
   */


  var loadMapPage = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(stations, coords, options) {
      var mainContainer, header;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              mainContainer = document.getElementsByClassName('main')[0];
              header = document.getElementsByTagName('header')[0];
              _context2.next = 4;
              return fetchDynamicPage('../map.html');

            case 4:
              mainContainer.innerHTML = _context2.sent;
              header.style.display = "none";
              createMapView(stations, coords, options);

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function loadMapPage(_x2, _x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }();
  /**
   * Create the map.
   * @param {object} stations array of weather stations.
   * @param {object} initialCoords array of coordinates.
   * @param {string} options 'all' (to display every station) | 'single' to display one station.
   * 
   * Uses Leaflet.js library. Tiles are from mapbox.com
   */


  var createMapView = function createMapView(stations, initialCoords) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'all';
    var stationsMap = L.map('stationsMap').setView(initialCoords, 7); // initialize map style

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/light-v10',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoiZnJhbmNlc2NvdmlvbGFudGUiLCJhIjoiY2tjZzBobG9zMGF4MTJ4cXEyaWV5aDFodSJ9.sxP_T03_g-EJTaT3OLhSKg'
    }).addTo(stationsMap);

    if (options != 'all') {
      L.marker([stations.lat, stations.lon]).addTo(stationsMap).bindPopup('<b>' + stations.name + '</b><br>' + stations.elevation + ' m').openPopup();
    } else {
      var _iterator = _createForOfIteratorHelper(stations),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var station = _step.value;
          // add a markers to the map
          L.marker([station.lat, station.lon]).addTo(stationsMap).bindPopup('<b>' + station.name + '</b><br>' + station.elevation + ' m');
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  };
  /**
   * Refresh the stations' data on the main page.
   * 
   * Works asyncronously. 
   */


  var refreshData = function refreshData() {
    var getTime = new Date();
    APP.dom.addRefreshTime(getTime);
    APP.api.getData().then(function (data) {
      APP.dom.refreshHeaderView(data);
      APP.dom.refreshBodyView(data);
    })["catch"](function () {
      APP.api.getBackupData().then(function (data) {
        APP.dom.refreshHeaderView(data);
        APP.dom.refreshBodyView(data);
      })["catch"](function (error) {
        console.error(error);
      });
    });
  };
  /**
   * Start the data refresh.
   * @param {number} interval interval in seconds.
   * @returns {number} the interval id.
   */


  var runRefresh = function runRefresh(interval) {
    var intervalInMilliseconds = interval * 1000;
    var intervalId = setInterval(refreshData, intervalInMilliseconds);
    return intervalId;
  };
  /**
   * Pause the data refresh.
   * @param {number} intervalId id of the interval to sto.
   */


  var pauseRefresh = function pauseRefresh(intervalId) {
    clearInterval(intervalId);
  };
  /**
   * Grouped functions to create the main index view.
   * @param {object} data a resolved promise object.
   */


  var createView = function createView(data, refreshTime) {
    // hide loading gif
    if (data) {
      APP.dom.hideLoading();
    }

    APP.dom.createListView(data);
    APP.dom.makeHeaderClickable(data);
    APP.filters.searchFilter();
    APP.filters.countryFilter(); // after the data is received start the refresh

    var intervalId = APP.utils.runRefresh(refreshTime);
    APP.dom.refreshButton(intervalId, refreshTime); // add map link to index

    APP.dom.setMapLink(data);
  };

  return {
    loadMapPage: loadMapPage,
    createMapView: createMapView,
    createView: createView,
    runRefresh: runRefresh,
    pauseRefresh: pauseRefresh
  };
}();