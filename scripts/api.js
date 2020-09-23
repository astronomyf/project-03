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

    function x () {
        console.log('ciao');
    }

    return {
        // return public variables and functions
        data,
        x
    }
 })();
 