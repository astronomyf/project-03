/**
 * @file utils.js
 * @author Francesco Violante
 * 
 * Utils module for the weather stations dashboard.
 * 
 * Utility functions used in other modules.
 */


APP.utils = (() => {

    const fetchDynamicPage = async (page) => {
        const response = await fetch(page);
        return await response.text();
    }

    const loadMapPage = async (stations, coords, options) => {
        const mainContainer = document.getElementsByClassName('main')[0];
        const header = document.getElementsByTagName('header')[0];

        mainContainer.innerHTML = await fetchDynamicPage('../map.html');
        header.style.display = "none";

        createMapView(stations, coords, options);
    }

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

    const refreshData = () => {

        let getTime = new Date();
        APP.dom.addRefreshTime(getTime);

        APP.api.getData()
        .then((data) => {

            APP.dom.refreshHeaderView(data);
        })
        .catch(() => {

            APP.api.getBackupData()
            .then((data) => {

                APP.dom.refreshHeaderView(data);
            })
            .catch((error) => {
                console.error(error);
            });
        });
    }

    const runRefresh = (interval) => {

        let intervalInMilliseconds = interval * 1000;
        let intervalId = setInterval(refreshData, intervalInMilliseconds);

        return intervalId;
    }

    const pauseRefresh = (intervalId) => {
        clearInterval(intervalId);
    }

    const createView = (data) => {

        APP.dom.createListView(data);
        APP.dom.makeHeaderClickable(data);
        APP.filters.searchFilter();
        APP.filters.countryFilter();
    }

    return {
        loadMapPage,
        createMapView,
        createView,
        runRefresh,
        pauseRefresh
    }
})();