/**
 * @file config.js
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
                    webcamLiveUrl2, weatherIcon, temperature, 
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