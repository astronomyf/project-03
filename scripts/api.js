/**
 * @file api.js
 * @author Francesco Violante
 * 
 * Functions for calling the api and store the data received.
 */

 if(!APP) {
     let APP = {};
 }

 APP.api = (() => {
    
    // api functions 
    const getData = async () => {

        const response = await fetch("https://www.torinometeo.org/api/v1/realtime/data/", {
            header: {
                "Content-Type": "application/json" 
            }
        });
    
        if(response.ok) {
            const data = await response.json();
            
            // for(const res of data) {
    
            //      const station = res.station;
            //      stations.push(new Station(station.id, 
            //                                 station.city, 
            //                                 station.description, 
            //                                 station.nation.name, 
            //                                 station.nation.alpha2_code, 
            //                                 station.region.name, 
            //                                 station.province.name, 
            //                                 station.lat, station.lon, 
            //                                 station.elevation, 
            //                                 station.image_url, 
            //                                 station.webcam, 
            //                                 res.weather_icon.icon, 
            //                                 res.temperature, 
            //                                 res.relative_humidity));
            //  }
            return data;
    
        } else {
            console.error("Data could not be obtained.", response.status);
            
            return null;
        }
    
     }

    return {
        // return public variables and functions
        getData
    }
 })();
 