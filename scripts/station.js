/**
 * @file config.js
 * @author Francesco Violante
 * 
 * Class module for the weather stations dashboard.
 */

 APP.model = (() => {

    class Station {

        constructor(id, name, description, nation, nationCode, region, province, lat, lon, elevation, stationImage, webcamLiveUrl, weatherIcon, temperature, humidity) {
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
            this.weatherIcon = weatherIcon;
            this.temperature = temperature;
            this.humidity = humidity;  
        }
    }

    return {
        Station
    }

 })();