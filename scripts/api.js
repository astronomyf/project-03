/**
 * @author Francesco Violante
 * @file api.js
 * 
 * Api functions.
 */

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
        //  }

        return data;

    } else {
        console.error("Data could not be obtained.", response.status);
        
        return null;
    }

 }

 const createTableView = () => {

    const listContainer = document.getElementById('main-list-container');
    const loaderGif = document.getElementById("loader-div");

    loaderGif.style.display = "none";

    console.log(stations);

    for(const station of stations) {

        const templateView = `<div class="list-card col-12">
        <h2>${station.name}</h2>
        </div>`;

        listContainer.insertAdjacentHTML('beforeend', templateView);
    }
 }

 getData().then(() => {
    createTableView();
 });



                