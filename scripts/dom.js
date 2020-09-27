/**
 * @file dom.js
 * @author Francesco Violante
 * 
 * Dom module for the weather stations dashboard.
 * 
 * Functions used to manipulate the dom and display data on the page.
 */

APP.dom = (() => {

    const setMenuLinks = (stations) => {
        const linkList = document.querySelectorAll('.menu-list li a');

        // menu link
        linkList[2].addEventListener('click', () => {

            APP.utils.loadMapPage(stations, [stations[61].lat, stations[61].lon], 'all');
            fixMapView();
        });
    }

    const fixMapView = () => {
        const gridContainer = document.getElementsByClassName('grid-container')[0];
        const mainContainer = document.getElementsByClassName('main')[0];

        gridContainer.setAttribute('style', 'grid-template-areas: "sidenav main" "sidenav main"');
        mainContainer.setAttribute('style', 'padding: 0px');
    }

    const hideLoading = () => {
        const loadingImage = document.getElementById('loading-img');
        loadingImage.remove();
    }

    const colorTemperature = (station) => {
        let color = '49c6ff';

        if(!station.temperature) {
            return '3238D9';
        }

        if(station.temperature > 15 && station.temperature < 25) {
            color = 'f5b13c';
        }

        if(station.temperature > 25) {
            color = 'd93232';
        }
        
        return color;
    }

    const openStationInMap = (station, target) => {
        const stationButton = target.nextElementSibling.querySelector('a');

        stationButton.addEventListener('click', () => {

            APP.utils.loadMapPage(station, [station.lat, station.lon], 'single');
            fixMapView();
        });
    }

    const makeHeaderClickable = (stations) => {
        const stationNames = [].slice.call(document.getElementsByClassName('station-text-city'));

        for(const name of stationNames) {

            const header = name.parentElement;
            let pos = stations.map(e => e.name).indexOf(name.innerText.replace(/\s$/g, ''));

            header.addEventListener('click', (event) => {

                if(header.classList.contains('open')) {
                    header.nextElementSibling.remove();
                    header.classList.remove('open');

                } else {
                    header.classList.add('open');
                    createBodyList(stations[pos], event.currentTarget);
                    openStationInMap(stations[pos], event.currentTarget);
                }
                
            });
        }
    }

    const createListView = (stations) => {
        
        const listContainer = document.getElementById('main-list-container');

        for(const station of stations) {

            const templateView = `
            <div class="list-wrapper col-12">
                <div class="list-header align-items-center">
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
                    <div class="value-temperature" style="color:#${colorTemperature(station)}">${station.temperature == null ? 'N.D.' : station.temperature + '°C'}</div>
                    <div class="text-humidity">Humidity</div>
                    <div class="value-humidity">${station.humidity == null ? 'N.D.' : station.humidity + '%'}</div>
                    <div class="arrow-icon">
                        <i class="material-icons md-48 icon">keyboard_arrow_down</i>
                    </div>
                </div>
            </div>`;

            listContainer.insertAdjacentHTML('beforeend', templateView);
        }
    }

    const getLiveImage = (station) => {
        let url = station.webcamLiveUrl;

        if(!url) {
            url = station.webcamLiveUrl2;

            if(!url) {
                // use placeholder instead
                url = 'https://riabilitazionelavalle.it/wp-content/uploads/2016/10/orionthemes-placeholder-image.jpg';
            }
        }

        return url;
    }

    const createBodyList = (station, target) => {
        
        const bodyTemplate = `
            <div class="list-body">
                <div class="list-body-general">
                    <p>${station.description}</p>
                    <a class="btn btn-primary">Open in map</a>
                </div>
                <div class="list-body-info">
                    <div class="max-temperature d-flex flex-row align-items-center">
                        <i class="material-icons info-icon">map</i>
                        <div class="info-values d-flex flex-column">
                            ${station.maxTemp}°C<br>
                            <span>Max temperature</span>
                        </div>
                    </div>
                    <div class="min-temperature d-flex flex-row align-items-center">
                        <i class="material-icons info-icon">map</i>
                        <div class="info-values d-flex flex-column">
                            ${station.minTemp}°C<br>
                            <span>Min Temperature</span>
                        </div>
                    </div>
                    <div class="pressure d-flex flex-row align-items-center">
                        <i class="material-icons info-icon">map</i>
                        <div class="info-values d-flex flex-column">
                            ${station.maxHum}%<br>
                            <span>Max Humidity</span>
                        </div>
                    </div>
                    <div class="wind d-flex flex-row align-items-center">
                        <i class="material-icons info-icon">map</i>
                        <div class="info-values d-flex flex-column">
                            ${station.minHum}%<br>
                            <span>Min Humidity</span>
                        </div>
                    </div>
                    <div class="burst d-flex flex-row align-items-center">
                        <i class="material-icons info-icon">map</i>
                        <div class="info-values d-flex flex-column">
                            ${station.wind} km/s<br>
                            <span>Wind strength</span>
                        </div>
                    </div>
                    <div class="rain d-flex flex-row align-items-center">
                        <i class="material-icons info-icon">map</i>
                        <div class="info-values d-flex flex-column">
                            ${station.rain} mm<br>
                            <span>Daily Rain</span>
                        </div>
                    </div>
                </div>
                <div class="list-body-live" style="background-image:url(${getLiveImage(station)})"></div>
        </div>`;

        target.insertAdjacentHTML('afterend', bodyTemplate);
    }

    const refreshHeaderView = (stations) => {
        const stationsTemperature = [].slice.call(document.getElementsByClassName('value-temperature'));
        const stationsHumidity = [].slice.call(document.getElementsByClassName('value-humidity'));

        stations.forEach((station, index) => {
            stationsTemperature[index].style.color = colorTemperature(station);
            stationsTemperature[index].innerText = station.temperature + '°C';
            stationsHumidity[index].innerText = station.humidity + '%';
        });
    }

    const refreshBodyView = (stations) => {
         
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

    const refreshButton = (id, interval) => {
        const pauseButton = document.getElementById('pause-btn');

        pauseButton.addEventListener('click', () => {
            
            if(pauseButton.innerText == 'pause') {
                pauseButton.innerText = 'play_arrow';
                APP.utils.pauseRefresh(id);
            } else {
                pauseButton.innerText = 'pause';
                APP.utils.runRefresh(interval);
            }
        });
    }

    const addRefreshTime = (time) => {
        const timeContainer = document.querySelector('.info-container > span');
        timeContainer.innerText = time.toLocaleTimeString('it-IT');
    }

    return {

        createListView,
        createBodyList,
        makeHeaderClickable,
        refreshHeaderView,
        hideLoading,
        populateWeatherCard,
        showWeatherCard,
        setMenuLinks,
        showDataError,
        addRefreshTime,
        refreshButton
    }

})();