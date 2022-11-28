var API_key1 = '85b1e743583c0abec7333d043446850e';
var API_key2 = 'c99b2bd36d5dca4b01a0626259ed08d5';

//Form querySelectors
var userFormEl = document.querySelector('#city-form');
var userCityQueryEl = document.querySelector('#city-name');

//City button querySelectors
var featureCitiesBtns = document.querySelector('.city-btns');
var cityWeatherContainerEl = document.querySelector('#city-weather-container');

//Container elements to display weather info
var weatherResultsContainer = document.querySelector('#weather-container')
var weatherCityNane = document.querySelector('#weather-city-name');
var dateTimeEl = document.querySelector('#date-time');
var weatherDetails = document.querySelector('#weather-details');

//convert city to latitude and longitude
var getLatitudeLongitude = function (city) {
  var geocodeUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + API_key1;
  fetch(geocodeUrl)
    .then(function (res) {
      if (res.ok) {
        res.json().then(function (data) {
          console.log(data);
          var latitude = data[0].lat;
          var longitude = data[0].lon;
          //getFeatureCities(latitude, longitude)
          //console.log(latitude, longitude);
        })
      } else {
        alert('City not found');
      }
    })
    .catch(function (error) {
      alert('Unable to connect to the database.');
    });
}
//getLatitudeLongitude('Toronto')

//Get data of selected cities from featured buttons
var getFeatureCities = function (lat, lon) {
  //var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&appid=' + API_key1;

  //api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

  var apiUrl = 'api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + API_key2;
  console.log(apiUrl);

  fetch(apiUrl)
    .then(function (res) {
      if (res.ok) {
        res.json().then(function (data) {
          //displayWeather(data, city)
          console.log(data);
        })
      } else {
        alert('City not found');
      }
    })
    .catch(function (error) {
      alert('Unable to connect to the database.');
    })
};

//Get city name from feature city buttons and run getLatitudeLongitude() function
var featureCitiesBtn = function (event) {
  var city = event.target.getAttribute('data-city');
  console.log(city);
  //getLatitudeLongitude(city)

  if (city) {
    cityWeatherContainerEl = '';
    getLatitudeLongitude(city);
  };
};

//Collect city name from the input element, pass it to getWeatherData() and run this function
var formSubmit = function (event) {
  event.preventDefault();
  var citySearch = userCityQueryEl.value.trim();
  var city = citySearch.split(' ').join('+');
  console.log(city);

  if (city) {
    getWeatherData(city);
    userCityQueryEl.value = '';
  } else {
    alert('Please enter a valid city');
  };
};

//Get data from city name
var getWeatherData = function (city) {
  var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&appid=' + API_key1;
  fetch(apiUrl)
    .then(function (res) {
      if (res.ok) {
        res.json().then(function (data) {
          displayWeather(data, city)
          //console.log(data);
        })
      } else {
        alert('City not found');
      }
    })
    .catch(function (error) {
      alert('Unable to connect to the database.');
    })
};

//5-day forecast function
// var fiveDayForecast = function (lat, lon) {
//   var apiUrl5Days = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat=' + latitude + '&lon=' + longitude + '&cnt=5&appid=' + API_key2;

//   fetch(apiUrl5Days)
//     .then(function (res) {
//       if (res.ok) {
//         res.json().then(function (data) {
//           displayWeather(data)
//           console.log(data);
//         })
//       } else {
//         alert('City not found');
//       }
//     })
//     .catch(function (error) {
//       alert('Unable to connect to the database.');
//     });


//   console.log('5-Day Forecast')
//   console.log(apiUrl5Days);
// };



//Display weather in the webpage
var displayWeather = function (weather, cityQuery) {
  weatherDetails.textContent = '';
  //Adding city name from query to container
  weatherResultsContainer.classList.add('border');
  weatherResultsContainer.classList.add('border-secondary');
  weatherCityNane.textContent = cityQuery.split('+').join(' ');

  //Adding date
  var dateTime = moment().format("ddd, MMM D YYYY, h:mm a");
  dateTimeEl.textContent = dateTime;

  //Adding temp, wind and humidity
  var cityTemp = weather.main.temp;
  var tempEl = document.createElement("li");
  tempEl.innerHTML = 'Temp: ' + cityTemp + '°C'

  var cityWind = weather.wind.speed;
  var windEl = document.createElement("li");
  windEl.innerHTML = 'Wind: ' + cityWind + ' KPH'

  var cityHumidity = weather.main.humidity;
  var humidityEl = document.createElement("li");
  humidityEl.innerHTML = 'Humidity: ' + cityHumidity + '%'
  //console.log(cityTemp, cityWind, cityHumidity);

  weatherDetails.appendChild(tempEl);
  weatherDetails.appendChild(windEl);
  weatherDetails.appendChild(humidityEl);

  //getting latitude and longitude from selected city
  var cityLatitute = weather.coord.lat;
  var cityLongitude = weather.coord.lon;
  console.log(cityLatitute, cityLongitude)

  fiveDayForecast(cityLatitute, cityLongitude);

};



//Event listeners to run the queries
userFormEl.addEventListener('submit', formSubmit);
featureCitiesBtns.addEventListener('click', featureCitiesBtn);