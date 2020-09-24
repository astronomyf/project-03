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

    const hideLoading = () => {
        const loadingImage = document.getElementById('loading-img');
        loadingImage.remove();
    }

    const createTableView = (data) => {
        
        const listContainer = document.getElementById('main-list-container');

        for(const res of data) {

            const templateView = `
            <div class="list-card col-12 d-flex align-items-center">
                <div class="img-container">
                    <img class="img-rounded" src="${res.station.image_url}" alt="Station image"> 
                </div>
                <div class="station-text-city">
                    ${res.station.city}
                    <img clas="flag" src="https://www.countryflags.io/${res.station.nation.alpha2_code}/flat/16.png">
                </div>
                <div class="station-text-region">${res.station.region.name}, <span class="text-country">${res.station.nation.name}</span></div>
                <div class="text-altitude">Altitude</div>
                <div class="value-altitude">${res.station.elevation}m</div>
                <div class="text-temperature">Temperature</div>
                <div class="value-temperature">${res.temperature}°C</div>
                <div class="text-humidity">Humidity</div>
                <div class="value-humidity">${res.relative_humidity}%</div>
                <i class="material-icons md-48 arrow-icon">keyboard_arrow_down</i>
            </div>`;

            listContainer.insertAdjacentHTML('beforeend', templateView);
        }
    }

    const populateWeatherCard = (data) => {
        const city = document.getElementsByClassName('locationCity')[0];
        const weather = document.getElementsByClassName('locationRegion')[0];
        const temperature = document.getElementsByClassName('card-temperature')[0];
        const humidityValue = document.getElementsByClassName('humidity-value')[0];
        const humidityBar = document.getElementsByClassName('humidity-bar')[0];
        const precipValue = document.getElementsByClassName('precip-value')[0];
        const precipBar = document.getElementsByClassName('precip-bar')[0];

        city.innerText = data.name;
        weather.innerText = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
        temperature.innerText = (data.main.temp > 0 ? `${data.main.temp.toFixed(1)}` : `-${data.main.temp.toFixed(1)}`) + '°C';
        humidityValue.innerText = data.main.humidity + '%';
        precipValue.innerText = data.clouds.all + '%';
        humidityBar.style.width = data.main.humidity + '%';
        precipBar.style.width = data.clouds.all + '%';
    }

    return {

        createTableView,
        hideLoading,
        populateWeatherCard
    }
})();