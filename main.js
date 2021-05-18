//get result from search box when key is pressed
//if there is more than 3 characters
getAddressSearchValue();
function getAddressSearchValue() {
  const searchInput = document.querySelector('.search__input');

  searchInput.addEventListener('keyup', function (e) {
    let searchFor = searchInput.value;
    if (searchFor.length > 3) {
      console.log(searchFor);
      getGeoLocation(searchFor);
    }
  });
}

//---------------------------------------------------------------------

//get geolocation latitude and longitude
const getGeoLocation = async function (address) {
  let locationLngLat;
  let locationDataTitle;
  try {
    //fetch geo location
    let getGeo = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyA8-bJwYvWll9l7TwFW5b9TiJ9HMWPDljU`
    );
    //// get latitude and longitude
    let geoData = await getGeo.json();
    locationDataTitle = geoData.results[0].formatted_address;
    locationLngLat = geoData.results[0].geometry.location;
    console.log(geoData);
    //catch errors
    if (geoData.status != 'OK') {
      throw new Error();
    }
    //get weather according to location
    if (locationDataTitle) {
      console.log(locationDataTitle);
      getWeather(locationLngLat, locationDataTitle);
      //catch errors
    }
  } catch (error) {
    console.log('geolocation error');
  }
};

//---------------------------------------------------------------------

//get weather
getWeather = async function (locationLatLng, locationDataTitle) {
  let weatherData;
  try {
    //get weather using latitute and longitute from geo location
    let getWeather = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${locationLatLng.lat}&lon=${locationLatLng.lng}&exclude=minutely&units=metric&appid=ce96bebb0d2a102f5cda8e9f1d1b7c58`
    );
    //parse weather data
    weatherData = await getWeather.json();
    console.log(weatherData);
    //throw error
    if (weatherData.cod === '400') {
      throw new Error();
    }
    // catch errors
  } catch (err) {
    console.log('weather data error');
  }
  //render weather data
  renderWeatherData(weatherData, locationDataTitle);
};

//---------------------------------------------------------------------

//renders weather location title
function renderLocationTitle(location) {
  let selectColumn = document.querySelector(`.container`);
  let html = `<div class="title1" id="title">Weather for ${location}</div>`;
  selectColumn.insertAdjacentHTML('afterbegin', html);
}

//clears screen for new search
function clearScreen() {
  //clear error messages
  let geoError = document.getElementById('error');
  if (geoError) {
    geoError.remove();
  }
  //clears title
  let locationTitle = document.getElementById('title');
  if (locationTitle) {
    locationTitle.remove();
  }
  //clears weather render
  const weatherParent = document.getElementById('weather_render');
  while (weatherParent.firstChild != null) {
    let weatherFirstChild = weatherParent.firstChild;
    weatherParent.removeChild(weatherFirstChild);
  }
}

//checks screen size
function checkScreenSize() {
  const screenWidth = screen.width;
  let desktopOrMobile;
  screenWidth < 420
    ? (desktopOrMobile = 'mobile')
    : (desktopOrMobile = 'desktop');
  return desktopOrMobile;
}

//creates weather html elements
function createWeatherRenderHtmlElements() {
  const selectWeatherRender = document.getElementById('weather_render');
  for (let i = 0; i < 7; i++) {
    let createCol = document.createElement(`div${i}`);
    let setColClass = createCol.setAttribute('class', `a${i}col`);
    let appendCol = selectWeatherRender.appendChild(createCol);
    selectWeatherRender;
    createCol;
    setColClass;
    appendCol;
  }
}

//---------------------------------------------------------------------

//render weather data
function renderWeatherData(weatherData, locationDataTitle) {
  //clears screen for new search
  clearScreen();
  //create html elements to render weather
  createWeatherRenderHtmlElements();
  //renders title of weather location
  renderLocationTitle(locationDataTitle);

  //render weather
  for (let i = 0; i < 7; i++) {
    //generate weather datapoints to render
    let weatherUnixDate = weatherData.daily[0].dt;
    let weatherDay = new Date((weatherUnixDate + i * 86400) * 1000)
      .toString()
      .slice(0, 10);
    let weatherIcon = weatherData.daily[`${i}`].weather[0].icon;
    let weatherMaxTemp = Math.floor(weatherData.daily[`${i}`].temp.max);
    let weatherDesc = weatherData.daily[`${i}`].weather[0].main;

    //render desktop version
    if (checkScreenSize() === 'desktop') {
      let selectColumn = document.querySelector(`.a${i}col`);
      let html = `${weatherDay} <br>
        <img class='icon' src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png"></img><br> 
        ${weatherMaxTemp}&deg C ${weatherDesc}`;
      selectColumn.insertAdjacentHTML('beforeend', html);
    }

    if (checkScreenSize() === 'mobile') {
      let selectColumn = document.querySelector(`.a${i}col`);
      let html = `${weatherDay}
        <img class='icon' src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png"></img> 
        ${weatherMaxTemp}&deg C ${weatherDesc}`;
      selectColumn.insertAdjacentHTML('beforeend', html);
    }
  }

  //set weather display to visable
  document.querySelector('.row').style.visibility = 'visible';
}
