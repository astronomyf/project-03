/**
 * @file dom.js
 * @author Francesco Violante
 * 
 * Dom module for the weather stations dashboard.
 * 
 * Functions used to manipulate the dom and display data on the page.
 */

APP.dom = (() => {

    /**
     * Add a click event to the 'Map' link on the menu.
     * @param {object} stations array of stations.
     */
    const setMapLink = (stations) => {
        const linkList = document.querySelectorAll('.menu-list li a');

        // menu link
        linkList[1].addEventListener('click', () => {

            APP.utils.loadMapPage(stations, [stations[61].lat, stations[61].lon], 'all');
            fixMapView();
        });

        // menu link mobile
        linkList[3].addEventListener('click', () => {

            const mainContainer = document.getElementsByClassName('main')[0];
            mainContainer.style.padding = '0px';
            mainContainer.style.zIndex = '1';
            
            APP.utils.loadMapPage(stations, [stations[61].lat, stations[61].lon], 'all');
        });
    }

    /**
     * Make space on the container when the map has to be displayed.
     */
    const fixMapView = () => {
        const gridContainer = document.getElementsByClassName('grid-container')[0];
        const mainContainer = document.getElementsByClassName('main')[0];

        gridContainer.setAttribute('style', 'grid-template-areas: "sidenav main" "sidenav main"');
        mainContainer.setAttribute('style', 'padding: 0px');
    }

    /**
     * Hide the loading gif.
     */
    const hideLoading = () => {
        const loadingImage = document.getElementById('loading-img');
        loadingImage.remove();
    }

    /**
     * Get a color depending on a station temperature.
     * @param {object} station a station.
     * @returns {string} a color hex value.
     */
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

    /**
     * Add a click event to 'Open in Map' button.
     * @param {object} station a weather station.
     * @param {object} target target element to get the button.
     * 
     * Open a map set on the clicked station's cordinates.
     */
    const openStationInMap = (station, target) => {
        const stationButton = target.nextElementSibling.querySelector('a');

        stationButton.addEventListener('click', () => {

            APP.utils.loadMapPage(station, [station.lat, station.lon], 'single');
            if(window.innerWidth > 900) {
                fixMapView();
            } else {
                const mainContainer = document.getElementsByClassName('main')[0];
                mainContainer.style.padding = '0px';
                mainContainer.style.zIndex = '1';
            }
        });
    }

    /**
     * Make a station's list header clickable.
     * @param {object} stations array of weather stations.
     * 
     * If the list is collapsed it will add the content of the body
     * otherwise will remove it.
     */
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

    /**
     * Dynamically create the headers of the list stations.
     * @param {object} stations array of weather stations.
     */
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
                    <div class="value-temperature opacity" 
                    style="color:#${colorTemperature(station)}">${station.temperature == null ? 'N.D.' : station.temperature + '°C'}
                    </div>
                    <div class="text-humidity">Humidity</div>
                    <div class="value-humidity opacity">${station.humidity == null ? 'N.D.' : station.humidity + '%'}</div>
                    <div class="arrow-icon">
                        <i class="material-icons md-48 icon">keyboard_arrow_down</i>
                    </div>
                </div>
            </div>`;

            listContainer.insertAdjacentHTML('beforeend', templateView);
        }
    }

    /**
     * Check if the live image from a station exist.
     * @param {object} station weather station object.
     * @returns {string} an image url.
     * 
     * If the first link is null, check the second link
     * if the second link is null, use a placeholder image instead.
     */
    const getLiveImage = (station) => {
        let url = station.webcamLiveUrl;
        
        if(!url) {

            url = station.webcamLiveUrl2;

            if(!url) {

                url = 'https://riabilitazionelavalle.it/wp-content/uploads/2016/10/orionthemes-placeholder-image.jpg';
            }
        }

        return url;
    }

    /**
     * Add opacity animation to an element.
     * @param {object} el a document object element.
     */
    const addAnimatedValues = (el) => {

        if (el.classList.contains('opacity')) {
            el.classList.remove('opacity');

            setTimeout (() => {
                el.classList.add('opacity');
            }, 0);

        } else {

            el.classList.add('opacity');
        }
    }

    /**
     * Create the body content of a station.
     * @param {object} station a weather station object.
     * @param {object} target a document object element.
     * 
     * When the station's list header is clicked this will be added
     * to the html.
     */
    const createBodyList = (station, target) => {
        
        const bodyTemplate = `
            <div class="list-body">
                <div class="list-body-general">
                    <div class="station-weather opacity">
                        <b>Weather conditions: </b>
                        <img src="${station.weatherIcon}">
                        <span>${station.weatherDescr}</span>
                    </div>
                    <div class="station-description">${station.description}</div>
                    <a class="btn btn-primary">Open in map</a>
                </div>
                <div class="list-body-info">
                    <div class="max-temperature d-flex flex-row align-items-center">
                        <img class="info-icon" src="resources/img/temperaturapiu.svg">  
                        <div class="info-values d-flex flex-column">
                            <div class="max-temp-value opacity">${station.maxTemp == null ? 'N.D.' : station.maxTemp + '°C'}</div>
                            <span>Max temperature</span>
                        </div>
                    </div>
                    <div class="min-temperature d-flex flex-row align-items-center">
                        <img class="info-icon" src="resources/img/temperaturameno.svg">
                        <div class="info-values d-flex flex-column">
                            <div class="min-temp-value opacity">${station.minTemp == null ? 'N.D.' : station.minTemp + '°C'}</div>
                            <span>Min Temperature</span>
                        </div>
                    </div>
                    <div class="pressure d-flex flex-row align-items-center">
                        <img class="info-icon" src="resources/img/umiditapiu.svg">
                        <div class="info-values d-flex flex-column">
                            <div class="max-hum-value opacity">${station.maxHum == null ? 'N.D.' : station.maxHum + '%'}</div>
                            <span>Max Humidity</span>
                        </div>
                    </div>
                    <div class="wind d-flex flex-row align-items-center">
                        <img class="info-icon" src="resources/img/umiditameno.svg">
                        <div class="info-values d-flex flex-column">
                            <div class="min-hum-value opacity">${station.minHum == null ? 'N.D.' : station.minHum + '%'}</div>
                            <span>Min Humidity</span>
                        </div>
                    </div>
                    <div class="burst d-flex flex-row align-items-center">
                        <img class="info-icon" src="resources/img/vento.svg">
                        <div class="info-values d-flex flex-column">
                            <div class="wind-value opacity">${station.wind == null ? 'N.D.' : station.wind + ' km/s'}</div>
                            <span>Wind strength</span>
                        </div>
                    </div>
                    <div class="rain d-flex flex-row align-items-center">
                        <img class="info-icon" src="resources/img/pioggia.svg">
                        <div class="info-values d-flex flex-column">
                            <div class="rain-value opacity">${station.rain == null ? 'N.D.' : station.rain + ' mm'}</div>
                            <span>Daily Rain</span>
                        </div>
                    </div>
                </div>
                <div class="list-body-live">
                    <img class="list-body-image" src="${getLiveImage(station)}" 
                        onerror="this.onerror=null;this.src='https://riabilitazionelavalle.it/wp-content/uploads/2016/10/orionthemes-placeholder-image.jpg'" 
                        style="width:100%; height:100%;">
                </div>
        </div>`;

        target.insertAdjacentHTML('afterend', bodyTemplate);
    }

    /**
     * Replace the content of the header values.
     * @param {object} stations array of weather stations.
     */
    const refreshHeaderView = (stations) => {
        const stationsTemperature = [].slice.call(document.getElementsByClassName('value-temperature'));
        const stationsHumidity = [].slice.call(document.getElementsByClassName('value-humidity'));

        stations.forEach((station, index) => {
            stationsTemperature[index].style.color = colorTemperature(station);
            stationsTemperature[index].innerText = station.temperature == null ? 'N.D.' : station.temperature + '°C';
            stationsHumidity[index].innerText = station.humidity == null ? 'N.D.' : station.humidity + '°%';

            // add animation
            addAnimatedValues(stationsTemperature[index]);
            addAnimatedValues(stationsHumidity[index]);
        });
    }

    /**
     * Replace the content of the list body stations values.
     * @param {object} stations array of weather stations.
     * 
     * Refresh the content only on opened lists and not hidden by the filters.
     */
    const refreshBodyView = (stations) => {
         const maxTemperature = [].slice.call(document.getElementsByClassName('max-temp-value'));
         const minTemperature = [].slice.call(document.getElementsByClassName('min-temp-value'));
         const maxHumidity = [].slice.call(document.getElementsByClassName('max-hum-value'));
         const minHumidity = [].slice.call(document.getElementsByClassName('min-hum-value'));
         const windValue = [].slice.call(document.getElementsByClassName('wind-value'));
         const rainValue = [].slice.call(document.getElementsByClassName('rain-value'));
         const liveImage = [].slice.call(document.getElementsByClassName('list-body-live'));
         const weatherInfoContainer = [].slice.call(document.getElementsByClassName('station-weather'));
         const weatherIcon = [].slice.call(document.querySelectorAll('.station-weather > img'));
         const weatherDescr = [].slice.call(document.querySelectorAll('.station-weather span'));

         if(maxTemperature.length > 0) {

            maxTemperature.forEach((temp, index) => {

                const header = temp.parentElement.parentElement.parentElement.parentElement.parentElement;
                const cityName = temp.parentElement.parentElement.parentElement.parentElement.parentElement
                .firstElementChild.firstElementChild.nextElementSibling.innerText.replace(/\s$/, '');
                let pos = stations.map(e => e.name).indexOf(cityName);
                
                if(!header.hasAttribute('style')) {
                    maxTemperature[index].innerText = stations[pos].maxTemp == null ? 'N.D.' : stations[pos].maxTemp + '°C';
                    minTemperature[index].innerText = stations[pos].minTemp == null ? 'N.D' : stations[pos].minTemp + '°C';
                    maxHumidity[index].innerText = stations[pos].maxHum == null ? 'N.D' : stations[pos].maxHum + '%';
                    windValue[index].innerText = stations[pos].wind == null ? 'N.D' : stations[pos].wind + ' km/s';
                    minHumidity[index].innerText = stations[pos].minHum == null ? 'N.D' : stations[pos].minHum + '%';
                    rainValue[index].innerText = stations[pos].rain == null ? 'N.D' : stations[pos].rain + ' mm';
                    liveImage[index].style.backgroundImage = `url(${getLiveImage(stations[pos])})`;
                    weatherIcon[index].src = stations[pos].weatherIcon;
                    weatherDescr[index].innerText = stations[pos].weatherDescr;

                    // add animation
                    addAnimatedValues(maxTemperature[index]);
                    addAnimatedValues(minTemperature[index]);
                    addAnimatedValues(maxHumidity[index]);
                    addAnimatedValues(minHumidity[index]);
                    addAnimatedValues(windValue[index]);
                    addAnimatedValues(rainValue[index]);
                    addAnimatedValues(liveImage[index]);
                    addAnimatedValues(weatherInfoContainer[index]);
                }
             });
         }
    }

    /**
     * Populates the content of the sidenav weather card.
     * @param {object} data a resolved promise object.
     */
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

    /**
     * Display the the weather card.
     * 
     * To be called after the api call is resolved.
     */
    const showWeatherCard = () => {
        const weatherCard = document.getElementById('weather-card');
        weatherCard.classList.add('animate-card');
    }

    /**
     * Show/hide the mobile menu when the user click on 
     * the hamburger icon.
     */
    const toggleMenu = () => {
        const menuIcon = document.getElementById("nav-menu");

        menuIcon.addEventListener('click', () => {
        
          const mobileMenu = document.getElementById("mobile-menu");
          
          if(mobileMenu.hasAttribute('style')) {

                mobileMenu.removeAttribute('style');
          } else {
                mobileMenu.setAttribute('style', 'display:block!important');
          }

        }, false);
    }

    /**
     * Add an error message at the top of the main content.
     * @param {string} errorType a string error.
     * 
     * Used to display data error or warning.
     */
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

    /**
     * Calls the refresh functions and makes possibile to play and pause.
     * @param {number} id id of a setInterval.   
     * @param {number} interval interval in seconds.
     */
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

    /**
     * Insert the last refresh time on the page.
     * @param {object} time a date object.
     */
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
        setMapLink,
        showDataError,
        addRefreshTime,
        refreshButton,
        refreshBodyView,
        toggleMenu
    }

})();