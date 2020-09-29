import "core-js/stable";
import "regenerator-runtime/runtime";

 // global modules container 
 let APP = {};

 // api key for current location weather forecast
 APP.weatherApiKey = "d02c67194cb7a16c03754e73c563ae6d";

 // set refresh time
 APP.refreshTime = 30

 /**
 * @file station.js
 * @author Francesco Violante
 * 
 * Class module for the weather stations dashboard.
 */

APP.model = (() => {

    // class used to create the array of stations on api.js
    class Station {

        constructor(id, name, description, nation, 
                    nationCode, region, province, lat, lon, 
                    elevation, stationImage, webcamLiveUrl, 
                    webcamLiveUrl2, weatherIcon, weatherDescr, temperature, 
                    humidity, maxTemp, minTemp, maxHum, minHum, rain, wind) {

            this.id = id;
            this.name = name;
            this.description = description;
            this.nation = nation;
            this.nationCode = nationCode;
            this.region = region;
            this.province = province;
            this.lat = lat;
            this.lon = lon;
            this.elevation = elevation;
            this.stationImage = stationImage;
            this.webcamLiveUrl = webcamLiveUrl;
            this.webcamLiveUrl2 = webcamLiveUrl2;
            this.weatherIcon = weatherIcon;
            this.weatherDescr = weatherDescr;
            this.temperature = temperature;
            this.humidity = humidity;
            this.maxTemp = maxTemp; 
            this.minTemp = minTemp; 
            this.maxHum = maxHum; 
            this.minHum = minHum; 
            this.rain = rain; 
            this.wind = wind;  
        }
    }

    return {
        Station
    }

 })();

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
            const countryName = name.innerText;
            let pos = stations.map(e => e.name).indexOf(countryName.trim());

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
                .firstElementChild.firstElementChild.nextElementSibling.innerText.trim();
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

/**
 * @file api.js
 * @author Francesco Violante
 * 
 * Functions for calling the api and store the data received.
 */


APP.api = (() => {
    
    /**
     * Get data from an api.
     * @returns {object} array of station's objects.
     * 
     * Primary api call to torinometeo.org, fetch the data asyncronously and returns
     * an array of objects containing weather stations infos.
     */
    const getData = async () => {

        let stations = [];

        const response = await fetch("https://www.torinometeo.org/api/v1/realtime/data/", {
            header: {
                "Content-Type": "application/json" 
            }
        });
    
        if(response.ok) {
            const data = await response.json();
            
            for(const res of data) {
    
                 const station = res.station;
                 stations.push(new APP.model.Station(station.id, 
                                            station.city, 
                                            station.climate, 
                                            station.nation.name, 
                                            station.nation.alpha2_code, 
                                            station.region.name, 
                                            station.province.name, 
                                            station.lat, 
                                            station.lng, 
                                            station.elevation, 
                                            station.image_url, 
                                            station.webcam,
                                            station.webcam_url, 
                                            res.weather_icon.icon, 
                                            res.weather_icon.text,
                                            res.temperature, 
                                            res.relative_humidity,
                                            res.temperature_max,
                                            res.temperature_min,
                                            res.relative_humidity_max,
                                            res.relative_humidity_min,
                                            res.wind_strength,
                                            res.rain));
            }
        
            return stations;
    
        } else {
            console.error("Real time API is not up, using a backup instead. Server status: ", response.status);

            return null;
        }
    
     }
    
     /**
      * Get data from a backup api.
      * @returns {object} a resolved promise object.
      * 
      * If the primary api call fails, data will be called from a stored jsonblob.
      */
    const getBackupData = async () => {

        let stations = [];

        const response = await fetch("https://jsonblob.com/api/0ef3d095-fd97-11ea-b2e5-85f177c3d671", {
            header: {
                "Content-Type": "application/json" 
            }
        });

        if(!response.ok) {
            throw new Error('Network response was not ok. Backup API couldn\'t be displayed.');
        }

        const data = await response.json();

        for(const res of data) {
    
            const station = res.station;
            stations.push(new APP.model.Station(station.id, 
                                       station.city, 
                                       station.climate, 
                                       station.nation.name, 
                                       station.nation.alpha2_code, 
                                       station.region.name, 
                                       station.province.name, 
                                       station.lat, 
                                       station.lng, 
                                       station.elevation, 
                                       station.image_url, 
                                       station.webcam,
                                       station.webcam_url, 
                                       res.weather_icon.icon, 
                                       res.weather_icon.text,
                                       res.temperature, 
                                       res.relative_humidity,
                                       res.temperature_max,
                                       res.temperature_min,
                                       res.relative_humidity_max,
                                       res.relative_humidity_min,
                                       res.wind_strength,
                                       res.rain));
       }

        return stations;
    }

    /**
     * Get the current user position and populate the weather card.
     * 
     * Using the Geolocator API get the user coordinates and populate 
     * the weather card on the index page.
     */
    const getLocationWeatherInfo = () => {

        function success(position) {
            const lat  = position.coords.latitude;
            const lon = position.coords.longitude;

            callWeatherInfo({lat, lon})
            .then((data) => {
                APP.dom.populateWeatherCard(data);
                APP.dom.showWeatherCard();
            });
        }

        function error() {
            // if geolocation fails, show card with placeholder data
            APP.dom.showWeatherCard();
        }

        if(navigator.geolocation) {
            return navigator.geolocation.getCurrentPosition(success, error);
        }
    }

    /**
     * Call weather api and get the results for a given location.
     * @param {object} coords latitute and longitude.
     * @returns {object} a resolved promise object containing weather infos.
     * 
     * Call the openweathermap api using coordinates from the user location and 
     * an api key stored in the global object APP.
     */
    const callWeatherInfo = async (coords) => {

        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${APP.weatherApiKey}`;

        const response = await fetch(url, {
            header: {
                "Content-Type": "application/json" 
            }
        });

        if(!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const data = await response.json();

        return data;
    }

    return {
        getData,
        getBackupData,
        getLocationWeatherInfo
    }
 })();
 
 
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
    const runRefresh = () => {

        let intervalInMilliseconds = APP.refreshTime * 1000;
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
    const createView = (data) => {

        // hide loading gif
        if(data) {
            APP.dom.hideLoading();
        }

        APP.dom.createListView(data);
        APP.dom.makeHeaderClickable(data);
        APP.filters.searchFilter();
        APP.filters.countryFilter();

        // after the data is received start the refresh
        let intervalId = APP.utils.runRefresh();
        APP.dom.refreshButton(intervalId);

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

/**
 * @file filters.js
 * @author Francesco Violante
 * 
 * Filters module for the weather stations dashboard.
 */


APP.filters = (() => {

    // current active filters on the page
    let activeFilters = [];

    // filter select on index
    const selectElement = document.getElementsByTagName('select')[0]; 

    /**
     * Disable the value for a specific country inside the select tag.
     * @param {object} select a document object (select tag).
     * @param {string} target the name of the value to disable or activate.
     */
    const disableSelect = (select, target) => {

        for(let i = 0; i < select.length; i++) {
            if(select[i].value == target) {

                if(select[i].disabled == true) {
                    select[i].disabled = false;
                } else {
                    select[i].disabled = true;
                }
            }
        }
    }

    /**
     * Check if a country (or element) is inside the activeFilters array.
     * @param {string} el element to be checked.
     * @returns {boolean}
     */
    const checkArray = (el) => {

        for(const filter of activeFilters) {
            if(filter == el) {
                return true;
            }
        }

        return false;
    }

    /**
     * Search filter.
     * 
     * When a user type a letter in the searchbox the elements that don't match the list
     * of stations will not be displayed.
     */
    const searchFilter = () => {

        const searchBar = document.getElementsByClassName('search-bar')[0];
        const stationsList = [].slice.call(document.getElementsByClassName('station-text-city'));

        searchBar.addEventListener('keyup', () => {
                   
            for(const station of stationsList) {

                if(!selectElement.value) {

                    if(station.innerText.toUpperCase().search(searchBar.value.toUpperCase()) == -1) {
                        station.parentElement.parentElement.setAttribute('style', 'display:none!important');
                    } else {
                        station.parentElement.parentElement.removeAttribute('style');
                    }

                } else {

                    if(checkArray(station.nextElementSibling.firstElementChild.innerText)) {
                        if(station.innerText.toUpperCase().search(searchBar.value.toUpperCase()) == -1) {
                            station.parentElement.parentElement.setAttribute('style', 'display:none!important');
                        } else {
                            station.parentElement.parentElement.removeAttribute('style');
                        }
                    }
                }
            }
        }, false);
    }

    /**
     * Select filter to choose one (or more) countries.
     * 
     * When the user select a country to filter it will display the
     * selected filter in a box and disable it.
     */
    const countryFilter = () => {

        const stationsList = [].slice.call(document.getElementsByClassName('text-country'));
        const searchBar = document.getElementsByClassName('search-bar')[0];

        selectElement.addEventListener('change', () => {

            // create filter button
            filterButton();

            activeFilters.push(selectElement.value);

            // disable clicked filter
            disableSelect(selectElement, selectElement.value);

            // reset text inside search bar
            searchBar.value = "";

            for(const station of stationsList) {

                if(checkArray(station.innerText)) {
                    station.parentElement.parentElement.parentElement.removeAttribute('style');
                } else {
                    station.parentElement.parentElement
                    .parentElement.setAttribute('style', 'display:none!important');
                }
            }

        }, false);
    }

    /**
     * Filter button that is displayed after a user has chose 
     * a country to filter (can be comulative).
     */
    const filterButton = () => {
        
        const gridContainer = document.getElementsByClassName('grid-container')[0];
        const filterContainer = document.getElementById('custom-filters');

        const createButton = 
            `<span class="info-container filter-container">
            <span class="filter-text-country">${selectElement.value}</span>
            <i class="material-icons align-top close-icon">close</i></span>`;

        filterContainer.insertAdjacentHTML('beforeend', createButton);
        
        const filterButtonsIcon = [].slice.call(document.getElementsByClassName('close-icon'));

        let filteredButtons = filterButtonsIcon.filter((el) => {
            let countryName = el.parentElement.firstElementChild.innerText;
            return activeFilters.indexOf(countryName) != -1 ? false : true; 
        });

        filteredButtons.forEach((filter) => {

            filter.addEventListener('click', (event) => {
                const target = event.target.parentElement;                    
                const countryName = target.firstElementChild.innerText;
    
                disableSelect(selectElement, countryName);
    
                target.remove();
                activeFilters.splice(activeFilters.indexOf(countryName), 1);

                if(activeFilters.length == 0) {
                    gridContainer.removeAttribute('style');
                }

                hideFilterElements(countryName);

            }, false);
        });
    }

    /**
     * Hide the filter(s) box(es) when a user remove the filter.
     * @param {string} countryName a country name that match one of the filters.
     */
    const hideFilterElements = (countryName) => {
        const stationsList = [].slice.call(document.getElementsByClassName('text-country'));

        for(const station of stationsList) {
            if(activeFilters.length == 0) {
                selectElement.selectedIndex = 0;
                station.parentElement.parentElement.parentElement.removeAttribute('style');

            } else {

                if(station.innerText == countryName) {
                    station.parentElement.parentElement.parentElement.setAttribute('style', 'display:none!important');
                }
            }
        }
    }

    return {
        searchFilter,
        countryFilter
    }
})();

/**
 * @file main.js
 * @author Francesco Violante
 * 
 * Main page for the weather stations dashboard.
 */

(() => {

    let time = new Date();

    // add mobile menu
    APP.dom.toggleMenu();

    // add last refresh time
    APP.dom.addRefreshTime(time);

    // display weather card based on user location
    APP.api.getLocationWeatherInfo();
    
    // main api endpoint call
    APP.api.getData()
    .then((data) => {

        APP.utils.createView(data);
    })
    .catch(() => {

        // if primary api fails, use the backup data
        APP.api.getBackupData()
        .then((data) => {

            APP.dom.showDataError('warning');
            APP.utils.createView(data);

        })
        .catch(error => {

            // if second api call fails, show the user an error message
            console.error(error);

            APP.dom.hideLoading();
            APP.dom.showDataError('danger');
        });
    });

})();