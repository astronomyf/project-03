/**
 * @file utils.js
 * @author Francesco Violante
 * 
 * Utils module for the weather stations dashboard.
 * 
 * Utility functions used in other modules.
 */


APP.utils = (() => {

    // utils functions
    // here write variables and declare functions

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

    return {
        loadDynamicPage
    }
})();