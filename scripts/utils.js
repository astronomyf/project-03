/**
 * @file utils.js
 * @author Francesco Violante
 * 
 * Utils module for the weather stations dashboard.
 * 
 * Utility functions used in other modules.
 */


APP.utils = (() => {

    /**
     * Fetch a local html page.
     * @param {string} page an html page that exists on the website.
     * @returns {object}
     */
    const fetchDynamicPage = async (page) => {
        const response = await fetch(page);
        return await response.text();
    }

    /**
     * Load the map page.
     * @param {object} stations array of weather stations.
     * @param {object} coords array of coordinates.
     * @param {string} options 'all' (to display every station) | 'single' to display one station.
     */
    const loadMapPage = async (stations, coords, options) => {
        const mainContainer = document.getElementsByClassName('main')[0];
        const header = document.getElementsByTagName('header')[0];

        mainContainer.innerHTML = await fetchDynamicPage('./map.html');
        header.style.display = "none";

        createMapView(stations, coords, options);
    }

    /**
     * Create the map.
     * @param {object} stations array of weather stations.
     * @param {object} initialCoords array of coordinates.
     * @param {string} options 'all' (to display every station) | 'single' to display one station.
     * 
     * Uses Leaflet.js library. Tiles are from mapbox.com
     */
    const createMapView = (stations, initialCoords, options = 'all') => {
        const stationsMap = L.map('stationsMap').setView(initialCoords, 7);

        // initialize map style
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/light-v10',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoiZnJhbmNlc2NvdmlvbGFudGUiLCJhIjoiY2tjZzBobG9zMGF4MTJ4cXEyaWV5aDFodSJ9.sxP_T03_g-EJTaT3OLhSKg'
        }).addTo(stationsMap);

        if(options != 'all') {

            L.marker([stations.lat, stations.lon]).addTo(stationsMap)
            .bindPopup('<b>' + stations.name + '</b><br>' + stations.elevation + ' m')
            .openPopup();

        } else {

            for(const station of stations) {
                // add a markers to the map
                L.marker([station.lat, station.lon]).addTo(stationsMap)
                .bindPopup('<b>' + station.name + '</b><br>' + station.elevation + ' m');
            }
        }

    }

    /**
     * Refresh the stations' data on the main page.
     * 
     * Works asyncronously. 
     */
    const refreshData = () => {

        let getTime = new Date();
        APP.dom.addRefreshTime(getTime);

        APP.api.getData()
        .then((data) => {

            APP.dom.refreshHeaderView(data);
            APP.dom.refreshBodyView(data);
        })
        .catch(() => {

            APP.api.getBackupData()
            .then((data) => {

                APP.dom.refreshHeaderView(data);
                APP.dom.refreshBodyView(data);
            })
            .catch((error) => {
                console.error(error);
            });
        });
    }

    /**
     * Start the data refresh.
     * @param {number} interval interval in seconds.
     * @returns {number} the interval id.
     */
    const runRefresh = (interval) => {

        let intervalInMilliseconds = interval * 1000;
        let intervalId = setInterval(refreshData, intervalInMilliseconds);

        return intervalId;
    }

    /**
     * Pause the data refresh.
     * @param {number} intervalId id of the interval to sto.
     */
    const pauseRefresh = (intervalId) => {
        clearInterval(intervalId);
    }

    /**
     * Grouped functions to create the main index view.
     * @param {object} data a resolved promise object.
     */
    const createView = (data, refreshTime) => {

        // hide loading gif
        if(data) {
            APP.dom.hideLoading();
        }

        APP.dom.createListView(data);
        APP.dom.makeHeaderClickable(data);
        APP.filters.searchFilter();
        APP.filters.countryFilter();

        // after the data is received start the refresh
        let intervalId = APP.utils.runRefresh(refreshTime);
        APP.dom.refreshButton(intervalId, refreshTime);

        // add map link to index
        APP.dom.setMapLink(data);
    }

    return {
        loadMapPage,
        createMapView,
        createView,
        runRefresh,
        pauseRefresh
    }
})();