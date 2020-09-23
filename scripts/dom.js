/**
 * @file dom.js
 * @author Francesco Violante
 * 
 * Dom module for the weather stations dashboard.
 * 
 * Functions used to manipulate the dom and display data on the page.
 */

APP.dom = (() => {

    // dom functions
    // here write variables and declare functions

    const createTableView = (data) => {
        
        const listContainer = document.getElementById('main-list-container');

        for(const res of data) {

            const templateView = `
            <div class="list-card col-12">
                <img class="img-rounded" src="${res.station.image_url}" alt="Station image"> 
                <div class="text-city">${res.station.city}</div>
                <img class="flag" src="img/italy-flag-waving-icon-64.png" alt="">
                <div class="text-region">${res.station.region.name}, ${res.station.nation.name}</div>
                <div class="text-altitude">Altitude</div>
                <div class="valor-altitude">${res.station.elevation}m</div>
                <div class="temperature">${res.temperature}°C</div>
                <div class="text-temperature">Temperature</div>
                <div class="text-humidity">Humidity</div>
                <div class="valor-humidity">${res.relative_humidity}%</div>
                <button type="button" class="personal-btn btn dropdown-toggle"></button>
            </div>`;

            listContainer.insertAdjacentHTML('beforeend', templateView);
        }
    }

    return {
        // return public variables and functions
        createTableView
    }
})();