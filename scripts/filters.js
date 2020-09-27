/**
 * @file filters.js
 * @author Francesco Violante
 * 
 * Filters module for the weather stations dashboard.
 */


APP.filters = (() => {

    let activeFilters = [];
    const selectElement = document.getElementsByTagName('select')[0]; 

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

    const checkArray = (el) => {

        for(const filter of activeFilters) {
            if(filter == el) {
                return true;
            }
        }

        return false;
    }

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
                    station.parentElement.parentElement.parentElement.setAttribute('style', 'display:none!important');
                }
            }

        }, false);
    }

    const filterButton = () => {
        
        const gridContainer = document.getElementsByClassName('grid-container')[0];
        const filterContainer = document.getElementById('custom-filters');

        const createButton = 
            `<span class="info-container filter-container">
            <span class="filter-text-country">${selectElement.value}</span>
            <i class="material-icons align-top close-icon">close</i></span>`;

        filterContainer.insertAdjacentHTML('beforeend', createButton);
        gridContainer.setAttribute('style', 'grid-template-rows: 230px');

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