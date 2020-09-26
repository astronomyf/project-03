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

    const loadDynamicPage = async (page) => {
        const mainContainer = document.getElementById('main-list-container');
        const header = document.getElementsByTagName('header')[0];
        mainContainer.innerHTML = await fetchDynamicPage(page);
        let x = 10;
        header.style.display = "none";
        document.getElementById('title-art').innerText = x;
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