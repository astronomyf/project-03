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
 