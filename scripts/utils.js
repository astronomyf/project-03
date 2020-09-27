/**
 * @file utils.js
 * @author Francesco Violante
 * 
 * Utils module for the weather stations dashboard.
 * 
 * Utility functions used in other modules.
 */


APP.utils = (() => {

    const fetchDynamicPage = async (page) => {
        const response = await fetch(page);
        return await response.text();
    }

    const loadMapPage = async () => {
        const mainContainer = document.getElementsByClassName('main')[0];
        const header = document.getElementsByTagName('header')[0];

        mainContainer.innerHTML = await fetchDynamicPage('../map.html');

        let x = 10;
        header.style.display = "none";
        document.getElementById('title-art').innerText = x;
    }

    const loadHomePage = async () => {
        const mainContainer = document.getElementById('main-list-container');
        mainContainer.innerHTML = await fetchDynamicPage('../stations.html');
    }

    const refreshData = () => {

        let getTime = new Date();
        APP.dom.addRefreshTime(getTime);

        APP.api.getData()
        .then((data) => {

            APP.dom.refreshListView(data);
        })
        .catch(() => {

            APP.api.getBackupData()
            .then((data) => {

                APP.dom.refreshListView(data);
            })
            .catch((error) => {
                console.error(error);
            });
        });
    }

    const runRefresh = (interval) => {

        let intervalInMilliseconds = interval * 1000;
        let intervalId = setInterval(refreshData, intervalInMilliseconds);

        return intervalId;
    }

    const pauseRefresh = (intervalId) => {
        clearInterval(intervalId);
    }

    const createView = (data) => {

        APP.dom.createListView(data);
        APP.dom.makeHeaderClickable(data);
        APP.filters.searchFilter();
        APP.filters.countryFilter();
    }

    return {
        loadDynamicPage,
        createView,
        runRefresh,
        pauseRefresh
    }
})();