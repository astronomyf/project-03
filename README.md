# Weather Station Project

_The following summary is interactive: You can click on a title and go directly to the relative section_

<div id='summary'>

### Summary:

1. [Introduction](#introduction)
2. [Project Description](#project-description)
3. [Configuration and Technical Characteristics](#configuration)
4. [Usage](#usage)
5. [Files and Project structure](#files)
6. [Authors](#authors)
7. [Features](#features)
8. [External Resources](#external-resources)
9. [Browser Compatibility](#browser-compatibility)
10. [License and Contact](#license)
11. [Changelog and Version History](#changelog)

<div id='introduction'/>

## Introduction

The Weather Station Project's aim is the creation of an application that displays a list of real-time weather information from weather stations in various countries. This is our first work as a team: we decided to split the things to do in equal parts and it was a winning strategy because we managed to finish the whole project in the pre-established time limit.

[_Back to the summary_](#summary)

<div id='project-description'/>

## Project Description

**Weather Station** works as it follows: when the user open the `index.html` file the program starts showing a "loading animation", then it loads the weather stations. For each station you can immediately see some informations as the name, the photo, the temperature, altitude and humidity. If you need more informations you can click on the station card and the program will show you any others informations.

On the left there is a sidebar with the site name, two menu item and a weather card that shows you the informations about your current location.

On the top there is the searchbar (useful to find a specific station quickly) and a drop-down menu where you can choose the country.

Finally, on the right-top of the screen, you can see when the last update occurred, and pause the automatic refresh (default is 30 s)

[_Back to the summary_](#summary)

<div id='configuration'>

## Configuration and Technical Characteristics

The program refresh the weather informations every 30 seconds (that's the default settings when it is run for the first time). This setting is customizable by the user by clicking on the `SETTINGS` button on the right-top of the page.

The front page has been developed using **HTML 5** and **CSS**

We used the following colors for the page:

- Text Color (Navbar): `#ffffff`
- Text Color (Header): `#000000`
- Background color (Navbar and setting button):`#3238D9`
- Background color (Header and Body): `#ebebeb`

[_Back to the summary_](#summary)

<div id='usage'>

## Usage

#### How to run

**Note:** It's reccomendend to view the webpage using a Live Server (due to cors policy issues), if you're using VS Code you can easily find the plugin in the plugins section.

1. Open the `index.html` file with a browser of your choice 
2. The page will show all the stations with additional informations for each one. At this point you can do one of the following actions:
   - You can use the sidenav on the left to go to the map or return to the dashboard.
   - You can search for one specific station using the searchbar.
   - You can select a country from the appropriate drop-down menu.
     - You can pause the automatic refresh by clicking the `pause` button.
     - You can change the automatic refresh time by clicking the `setting` button.
3. If you need to know more about a place you can click on the relative weather station card and you will see more informations like the live webcam, the description and additional weather infos.

[_Back to the summary_](#summary)

<div id='files'>

## Files and Project structure

- Main Project Folder
  
  + `node_modules` folder containing all the node modules (left empty to reduce folder size, read package.json and package-lock.json for reference)
  - `css` folder
    - `style.css` contains the css rules for the page
  - `resources` folder
    - `fonts` (contains VAG-bold font)
    - `img` folder (contains the logo and the loading animations)
  - `dist` 
    * `bundle.js`  the final bundle to make the scripts load in older browsers
  - `src` 
    * `index.js` used to generate the final bundle
  - `polyfills`
    * `polyfills.js` polyfills used for older browsers
  
  - `scripts` folder
    - `api.js` this file contains the functions for calling the api and store the data received
    - `config.js`  this file contains the default settings for the program's first execution
    - `dom.js`  contains all the useful functions used for manipulating the
    - `filters.js` contains the filters module for the weather stations dashboard
    - `main.js`  main entry script that generates the buttons and creates the page with the default values
    - `station.js`  contains the class module for the weather stations dashboard
    - `utility.js` contains logic functions
  - `index.html` main entry page for the project
  - `.gitignore` 
  - `package.json` 
  - `package-lock.json`  
  - `babel.config.json` config file for the babel compiler
  - `LICENSE`
  - `README.md`
  
  [_Back to the summary_](#summary)
  
  <div id='authors'>
  
  ## Authors
  
  - **Francesco Violante**: _Team Leader, Programmer_ (`api.js`, `config.js`, `dom.js`, `filters.js`, `main.js`, `utils.js`, `index.html`, `style.css`, `station.js`) and compatibility with IE 11
  - **Emanuele Amicizia**: _Programmer_ (`dom.js`,`utils.js`, `index.html`, `style.css`)
  - **Simone Cavaliere**: _Programmer_ (`dom.js`, `main.js`, `index.html`,`style.css`, `readme.md`)
  - **Fabio Faggion**: _Programmer_ (`dom.js`, `utils.js`, `index.html`, `style.css`)

[_Back to the summary_](#summary)

<div id='features'>

## Features Delivered

This project is a complete application to manage a lot of weather stations information, it allows you to search a specific station, to see your current location weather and to personalize the information refresh frequency.

[_Back to the summary_](#summary)

<div id="external-resources">

## External Resources

Every part of this project was built by our team, but for the weather informations we used the API. We used **_MDN_** for the `polyfills.js` file, which helped us solving compatibility issues with IE11.

[_Back to the summary_](#summary)

<div id="browser-compatibility">

## Browser Compatibility

The program runs with every major browser, including:

- `Google Chrome`
- `Microsoft Edge`
- `Mozilla Firefox`
- `Safari`
- `Brave`
- `Internet Explorer 11*`

#### Internet Explorer 11*

To make the scripts works in IE 11 `Babel` was used to compile the ES6+ code to a ES5 syntax and then `Browserify` with `Babelify` were used to create a final bundle. 

##### Note

The scripts runs fine in IE 11 but, event tought we used `Autoprefixer`, CSS has some problems that we couldn't fix in time to have a complete experience with the webpage in this particular browser.

[_Back to the summary_](#summary)

<div id="license">

## License

```
MIT License

Copyright (c) 2020 Francesco Violante, Emanuele Amicizia, Simone Cavaliere, Fabio Faggion

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

[_Back to the summary_](#summary)
