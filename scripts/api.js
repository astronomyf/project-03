/**
 * @file api.js
 * @author Francesco Violante
 * 
 * Functions for calling the api and store the data received.
 */


 APP.api = (() => {

    let stations = [];
    
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
            // }
        
            return data;
    
        } else {
            console.error("Real time API is not up, using a backup instead. Server status: ", response.status);

            return null;
        }
    
     }
    
    const getBackupData = async () => {

        const response = await fetch("https://jsonblob.com/api/0ef3d095-fd97-11ea-b2e5-85f177c3d671", {
            header: {
                "Content-Type": "application/json" 
            }
        });

        if(!response.ok) {
            throw new Error('Network response was not ok. Backup API couldn\'t be displayed.');
        }

        const data = await response.json();

        return data;
    }

    return {
        getData,
        getBackupData
    }
 })();
 