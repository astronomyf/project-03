"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * @file filters.js
 * @author Francesco Violante
 * 
 * Filters module for the weather stations dashboard.
 */
APP.filters = function () {
  // current active filters on the page
  var activeFilters = []; // filter select on index

  var selectElement = document.getElementsByTagName('select')[0];
  /**
   * Disable the value for a specific country inside the select tag.
   * @param {object} select a document object (select tag).
   * @param {string} target the name of the value to disable or activate.
   */

  var disableSelect = function disableSelect(select, target) {
    for (var i = 0; i < select.length; i++) {
      if (select[i].value == target) {
        if (select[i].disabled == true) {
          select[i].disabled = false;
        } else {
          select[i].disabled = true;
        }
      }
    }
  };
  /**
   * Check if a country (or element) is inside the activeFilters array.
   * @param {string} el element to be checked.
   * @returns {boolean}
   */


  var checkArray = function checkArray(el) {
    var _iterator = _createForOfIteratorHelper(activeFilters),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var filter = _step.value;

        if (filter == el) {
          return true;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return false;
  };
  /**
   * Search filter.
   * 
   * When a user type a letter in the searchbox the elements that don't match the list
   * of stations will not be displayed.
   */


  var searchFilter = function searchFilter() {
    var searchBar = document.getElementsByClassName('search-bar')[0];
    var stationsList = [].slice.call(document.getElementsByClassName('station-text-city'));
    searchBar.addEventListener('keyup', function () {
      var _iterator2 = _createForOfIteratorHelper(stationsList),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var station = _step2.value;

          if (!selectElement.value) {
            if (station.innerText.toUpperCase().search(searchBar.value.toUpperCase()) == -1) {
              station.parentElement.parentElement.setAttribute('style', 'display:none!important');
            } else {
              station.parentElement.parentElement.removeAttribute('style');
            }
          } else {
            if (checkArray(station.nextElementSibling.firstElementChild.innerText)) {
              if (station.innerText.toUpperCase().search(searchBar.value.toUpperCase()) == -1) {
                station.parentElement.parentElement.setAttribute('style', 'display:none!important');
              } else {
                station.parentElement.parentElement.removeAttribute('style');
              }
            }
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }, false);
  };
  /**
   * Select filter to choose one (or more) countries.
   * 
   * When the user select a country to filter it will display the
   * selected filter in a box and disable it.
   */


  var countryFilter = function countryFilter() {
    var stationsList = [].slice.call(document.getElementsByClassName('text-country'));
    var searchBar = document.getElementsByClassName('search-bar')[0];
    selectElement.addEventListener('change', function () {
      // create filter button
      filterButton();
      activeFilters.push(selectElement.value); // disable clicked filter

      disableSelect(selectElement, selectElement.value); // reset text inside search bar

      searchBar.value = "";

      var _iterator3 = _createForOfIteratorHelper(stationsList),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var station = _step3.value;

          if (checkArray(station.innerText)) {
            station.parentElement.parentElement.parentElement.removeAttribute('style');
          } else {
            station.parentElement.parentElement.parentElement.setAttribute('style', 'display:none!important');
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }, false);
  };
  /**
   * Filter button that is displayed after a user has chose 
   * a country to filter (can be comulative).
   */


  var filterButton = function filterButton() {
    var gridContainer = document.getElementsByClassName('grid-container')[0];
    var filterContainer = document.getElementById('custom-filters');
    var createButton = "<span class=\"info-container filter-container\">\n            <span class=\"filter-text-country\">".concat(selectElement.value, "</span>\n            <i class=\"material-icons align-top close-icon\">close</i></span>");
    filterContainer.insertAdjacentHTML('beforeend', createButton);
    var filterButtonsIcon = [].slice.call(document.getElementsByClassName('close-icon'));
    var filteredButtons = filterButtonsIcon.filter(function (el) {
      var countryName = el.parentElement.firstElementChild.innerText;
      return activeFilters.indexOf(countryName) != -1 ? false : true;
    });
    filteredButtons.forEach(function (filter) {
      filter.addEventListener('click', function (event) {
        var target = event.target.parentElement;
        var countryName = target.firstElementChild.innerText;
        disableSelect(selectElement, countryName);
        target.remove();
        activeFilters.splice(activeFilters.indexOf(countryName), 1);

        if (activeFilters.length == 0) {
          gridContainer.removeAttribute('style');
        }

        hideFilterElements(countryName);
      }, false);
    });
  };
  /**
   * Hide the filter(s) box(es) when a user remove the filter.
   * @param {string} countryName a country name that match one of the filters.
   */


  var hideFilterElements = function hideFilterElements(countryName) {
    var stationsList = [].slice.call(document.getElementsByClassName('text-country'));

    var _iterator4 = _createForOfIteratorHelper(stationsList),
        _step4;

    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var station = _step4.value;

        if (activeFilters.length == 0) {
          selectElement.selectedIndex = 0;
          station.parentElement.parentElement.parentElement.removeAttribute('style');
        } else {
          if (station.innerText == countryName) {
            station.parentElement.parentElement.parentElement.setAttribute('style', 'display:none!important');
          }
        }
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
  };

  return {
    searchFilter: searchFilter,
    countryFilter: countryFilter
  };
}();