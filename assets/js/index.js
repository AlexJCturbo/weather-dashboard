var API_key = '85b1e743583c0abec7333d043446850e';

//Form querySelectors
var userFormEl = document.querySelector('#city-form');
var userCityQueryEl = document.querySelector('#city-name');

//City button querySelectors
var featureCitiesBtns = document.querySelector('.city-btns');
var cityWeatherContainerEl = document.querySelector('#city-weather-container');


//Get data of selected cities from featured buttons
var getFeatureCities = function (city) {
  var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + API_key;
  console.log(apiUrl);

  fetch(apiUrl)
    .then(function (res) {
      if (res.ok) {
        res.json().then(function (data) {
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

//Run the getFeatureCities() after clicking on any city button
var featureCitiesBtn = function (event) {
  var city = event.target.getAttribute('data-city');
  console.log(city);

  if (city) {
    cityWeatherContainerEl = '';
    getFeatureCities(city);
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
  var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + API_key;
  fetch(apiUrl)
    .then(function (res) {
      if (res.ok) {
        res.json().then(function (data) {
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

//Event listeners to run the queries
userFormEl.addEventListener('submit', formSubmit);
featureCitiesBtns.addEventListener('click', featureCitiesBtn);