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
        
        for(const country of data) {
            stations.push({
                id: country.station.id,
                status: "close"
            });
        }

        return data;

    } else {
        console.error("Data could not be obtained:", response.status);
        
        return null;
    }

 }



                