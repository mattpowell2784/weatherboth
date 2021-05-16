//get result for search box
getAddressSearchValue();
function getAddressSearchValue() {
  const searchButton = document.querySelector('.search__button');

  searchButton.addEventListener('click', function () {
    event.preventDefault();
    let searchFor = document.querySelector('.search__input').value;
    getGeoLocation(searchFor);
  });
}

//get geolocation latitude and longitude
const getGeoLocation = async function (address) {
  let locationGeo;
  let locationDataFor;
  try {
    //fetch geo location
    let getGeo = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyA8-bJwYvWll9l7TwFW5b9TiJ9HMWPDljU`
    );
    //parse data
    let geoData = await getGeo.json();
    console.log(geoData);
    locationDataFor = geoData.results[0].formatted_address;
    console.log(locationDataFor);
    //catch errors
    if (geoData.status != 'OK') {
      throw new Error();
    }
    // get latitude and longitude
    locationGeo = geoData.results[0].geometry.location;
  } catch (error) {
    let selectContainer = document.querySelector(`.error`);
    let html = `Please enter a valid town<br>`;
    selectContainer.insertAdjacentHTML('afterbegin', html);
  }
  //get weather according to location
  getWeather(locationGeo);
  if (locationDataFor) {
    renderLocationTitle(locationDataFor);
  }
};

//get weather
getWeather = async function (location) {
  try {
    //get weather using latitute and longitute from geo location
    let getWeather = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${location.lat}&lon=${location.lng}&exclude=minutely&units=metric&appid=ce96bebb0d2a102f5cda8e9f1d1b7c58`
    );
    //parse weather data
    let weatherData = await getWeather.json();
    console.log(weatherData);
    if (weatherData.cod === '400') {
      throw new Error();
    }

    //render weather data
    renderWeatherData(weatherData);
  } catch (error) {
    let selectColumn = document.querySelector(`.error`);
    let html = `Error getting location<br>`;
    selectColumn.insertAdjacentHTML('afterbegin', html);
  }
};

//render location title
function renderLocationTitle(location) {
  let selectColumn = document.querySelector(`.container`);
  let html = `<p id="location">Weather for ${location}</p>`;
  selectColumn.insertAdjacentHTML('afterbegin', html);
}

//removes error messages if required
function clearErrorMessages() {
  let geoError = document.getElementById('error_id');
  if (geoError) {
    geoError.remove();
  }
}

mobileOrDesktopHtmlSpacer = function checkScreenSize() {
  const screenWidth = screen.width;
  console.log(screenWidth);
  let spacer = '';

  screenWidth < 420 ? (spacer = '&nbsp') : (spacer = '<p></p>');
  console.log(spacer);
  return spacer;
};

//render weather data
function renderWeatherData(weatherData) {
  //removes error messages if required
  clearErrorMessages();

  //get mobile or desktop html spacer
  let spacer = mobileOrDesktopHtmlSpacer();

  //render weather
  for (let i = 0; i < 7; i++) {
    //render date
    let weather = weatherData.daily[0].dt;
    let date = new Date((weather + i * 86400) * 1000).toString().slice(0, 10);
    let selectColumn = document.querySelector(`.a${i}col`);
    let html = `<b>${date}</b>${spacer}`;
    selectColumn.insertAdjacentHTML('beforeend', html);

    //render icon
    weather = weatherData.daily[`${i}`].weather[0].icon;
    selectColumn = document.querySelector(`.a${i}col`);
    html = `<img class='icon' src="http://openweathermap.org/img/wn/${weather}@2x.png">${spacer}`;
    selectColumn.insertAdjacentHTML('beforeend', html);

    //render weather max temp
    weather = Math.floor(weatherData.daily[`${i}`].temp.max);
    selectColumn = document.querySelector(`.a${i}col`);
    html = `Max ${weather} &deg C${spacer}`;
    selectColumn.insertAdjacentHTML('beforeend', html);

    //render weather type
    weather = weatherData.daily[`${i}`].weather[0].main;
    selectColumn = document.querySelector(`.a${i}col`);
    html = `&nbsp &nbsp ${weather} &nbsp &nbsp `;
    selectColumn.insertAdjacentHTML('beforeend', html);

    //set weather display to visable
    document.querySelector('.row').style.visibility = 'visible';

    removeSearchFunction();
  }
}

//remove search button to stop rendering issues
function removeSearchFunction() {
  let searchButton = document.querySelector('.search__form');
  let searhHtml = `<input type="text" placeholder="" class="search__input"/>
                  <button class="btn search__dead">Reset</button>'`;
  searchButton.innerHTML = searhHtml;

  searchButton.addEventListener('click', function () {
    const searchButton = document.querySelector('.search__button');
  });
}
