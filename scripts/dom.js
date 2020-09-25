/**
 * @file dom.js
 * @author Francesco Violante
 * 
 * Dom module for the weather stations dashboard.
 * 
 * Functions used to manipulate the dom and display data on the page.
 */

APP.dom = (() => {

    const setMenuLinks = () => {
        const linkList = document.querySelectorAll('.menu-list li a');

        // menu link
        linkList[2].addEventListener('click', () => {
            APP.utils.loadDynamicPage('../about.html');
        });
    }

    const hideLoading = () => {
        const loadingImage = document.getElementById('loading-img');
        loadingImage.remove();
    }

    const createTableView = (stations) => {
        
        const listContainer = document.getElementById('main-list-container');

        for(const station of stations) {

            const templateView = `
            <div class="list-card col-12 d-flex align-items-center">
                <div class="img-container">
                    <img class="img-rounded" src="${station.stationImage}" alt="Station image"> 
                </div>
                <div class="station-text-city">
                    ${station.name}
                    <img clas="flag" src="https://www.countryflags.io/${station.nationCode}/flat/16.png">
                </div>
                <div class="station-text-region">${station.region}, <span class="text-country">${station.nation}</span></div>
                <div class="text-altitude">Altitude</div>
                <div class="value-altitude">${station.elevation == null ? 'N.D.' : station.elevation}m</div>
                <div class="text-temperature">Temperature</div>
                <div class="value-temperature">${station.temperature == null ? 'N.D.' : station.temperature + '°C'}</div>
                <div class="text-humidity">Humidity</div>
                <div class="value-humidity">${station.humidity == null ? 'N.D.' : station.humidity + '%'}</div>
                <i class="material-icons md-48 arrow-icon">keyboard_arrow_down</i>
            </div>`;

            listContainer.insertAdjacentHTML('beforeend', templateView);
        }
    }

    const populateWeatherCard = (data) => {
        const actualDate = new Date();
        const city = document.getElementsByClassName('locationCity')[0];
        const weather = document.getElementsByClassName('locationRegion')[0];
        const weatherIcon = document.getElementsByClassName('weather-icon')[0];
        const time = document.getElementsByClassName('card-title')[0];
        const weekDate = document.getElementsByClassName('date')[0];
        const temperature = document.getElementsByClassName('weather-temperature-value')[0];
        const humidityValue = document.getElementsByClassName('humidity-value')[0];
        const humidityBar = document.getElementsByClassName('humidity-bar')[0];
        const precipValue = document.getElementsByClassName('precip-value')[0];
        const precipBar = document.getElementsByClassName('precip-bar')[0];

        city.innerText = data.name;
        weather.innerText = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
        weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">`;
        time.innerText = actualDate.getHours() + ':' + actualDate.getMinutes();
        weekDate.innerText = actualDate.toDateString();
        temperature.innerText = data.main.temp.toFixed(1);
        humidityValue.innerText = data.main.humidity + '%';
        precipValue.innerText = data.clouds.all + '%';
        humidityBar.style.width = data.main.humidity + '%';
        precipBar.style.width = data.clouds.all + '%';
    }

    const showWeatherCard = () => {
        const weatherCard = document.getElementById('weather-card');
        weatherCard.classList.add('animate-card');
    }

    const showDataError = (errorType) => {
        const listContainer = document.getElementById('main-list-container');
        let warningTemplate;

        if(errorType == 'warning') {
            warningTemplate = `<div class="alert alert-warning" role="alert">
            Real time data is not responding. You're viewing backup data.
            </div>`;
        } else {
            warningTemplate = `<div class="alert alert-danger" role="alert">
            Real time data and backup data is not responding. Please try again later.
            </div>`;
        }

        listContainer.insertAdjacentHTML('beforeend', warningTemplate);
    }

    return {

        createTableView,
        hideLoading,
        populateWeatherCard,
        showWeatherCard,
        setMenuLinks,
        showDataError
    }
})();