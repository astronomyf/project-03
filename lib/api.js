"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * @file api.js
 * @author Francesco Violante
 * 
 * Functions for calling the api and store the data received.
 */
APP.api = function () {
  /**
   * Get data from an api.
   * @returns {object} array of station's objects.
   * 
   * Primary api call to torinometeo.org, fetch the data asyncronously and returns
   * an array of objects containing weather stations infos.
   */
  var getData = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var stations, response, data, _iterator, _step, res, station;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              stations = [];
              _context.next = 3;
              return fetch("https://www.torinometeo.org/api/v1/realtime/data/", {
                header: {
                  "Content-Type": "application/json"
                }
              });

            case 3:
              response = _context.sent;

              if (!response.ok) {
                _context.next = 13;
                break;
              }

              _context.next = 7;
              return response.json();

            case 7:
              data = _context.sent;
              _iterator = _createForOfIteratorHelper(data);

              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  res = _step.value;
                  station = res.station;
                  stations.push(new APP.model.Station(station.id, station.city, station.climate, station.nation.name, station.nation.alpha2_code, station.region.name, station.province.name, station.lat, station.lng, station.elevation, station.image_url, station.webcam, station.webcam_url, res.weather_icon.icon, res.temperature, res.relative_humidity, res.temperature_max, res.temperature_min, res.relative_humidity_max, res.relative_humidity_min, res.wind_strength, res.rain));
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }

              return _context.abrupt("return", stations);

            case 13:
              console.error("Real time API is not up, using a backup instead. Server status: ", response.status);
              return _context.abrupt("return", null);

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function getData() {
      return _ref.apply(this, arguments);
    };
  }();
  /**
   * Get data from a backup api.
   * @returns {object} a resolved promise object.
   * 
   * If the primary api call fails, data will be called from a stored jsonblob.
   */


  var getBackupData = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var response, data;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return fetch("https://jsonblob.com/api/0ef3d095-fd97-11ea-b2e5-85f177c3d671", {
                header: {
                  "Content-Type": "application/json"
                }
              });

            case 2:
              response = _context2.sent;

              if (response.ok) {
                _context2.next = 5;
                break;
              }

              throw new Error('Network response was not ok. Backup API couldn\'t be displayed.');

            case 5:
              _context2.next = 7;
              return response.json();

            case 7:
              data = _context2.sent;
              return _context2.abrupt("return", data);

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function getBackupData() {
      return _ref2.apply(this, arguments);
    };
  }();
  /**
   * Get the current user position and populate the weather card.
   * 
   * Using the Geolocator API get the user coordinates and populate 
   * the weather card on the index page.
   */


  var getLocationWeatherInfo = function getLocationWeatherInfo() {
    function success(position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      callWeatherInfo({
        lat: lat,
        lon: lon
      }).then(function (data) {
        APP.dom.populateWeatherCard(data);
        APP.dom.showWeatherCard();
      });
    }

    function error() {
      // if geolocation fails, show card with placeholder data
      APP.dom.showWeatherCard();
    }

    if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition(success, error);
    }
  };
  /**
   * Call weather api and get the results for a given location.
   * @param {object} coords latitute and longitude.
   * @returns {object} a resolved promise object containing weather infos.
   * 
   * Call the openweathermap api using coordinates from the user location and 
   * an api key stored in the global object APP.
   */


  var callWeatherInfo = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(coords) {
      var url, response, data;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              url = "https://api.openweathermap.org/data/2.5/weather?lat=".concat(coords.lat, "&lon=").concat(coords.lon, "&units=metric&appid=").concat(APP.weatherApiKey);
              _context3.next = 3;
              return fetch(url, {
                header: {
                  "Content-Type": "application/json"
                }
              });

            case 3:
              response = _context3.sent;

              if (response.ok) {
                _context3.next = 6;
                break;
              }

              throw new Error('Network response was not ok.');

            case 6:
              _context3.next = 8;
              return response.json();

            case 8:
              data = _context3.sent;
              return _context3.abrupt("return", data);

            case 10:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function callWeatherInfo(_x) {
      return _ref3.apply(this, arguments);
    };
  }();

  return {
    getData: getData,
    getBackupData: getBackupData,
    getLocationWeatherInfo: getLocationWeatherInfo
  };
}();