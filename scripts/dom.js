/**
 * @file dom.js
 * @author Francesco Violante
 * 
 * Dom module for the weather stations dashboard.
 * 
 * Functions used to manipulate the dom and display data on the page.
 */

APP.dom = (() => {

    // dom functions
    // here write variables and declare functions

    const createTableView = (data) => {
        
        const listContainer = document.getElementById('main-list-container');

        for(const res of data) {

            const templateView = `<div class="list-card col-12">
            <h2>${res.station.name}</h2>
            </div>`;

            listContainer.insertAdjacentHTML('beforeend', templateView);
        }
    }

    return {
        // return public variables and functions
        createTableView
    }
})();