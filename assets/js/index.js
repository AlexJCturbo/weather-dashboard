var API_key = '85b1e743583c0abec7333d043446850e';
//var API_key2 = 'c99b2bd36d5dca4b01a0626259ed08d5';

//Form querySelectors
var userFormEl = document.querySelector('#city-form');
var userCityQueryEl = document.querySelector('#city-name');

//City button querySelectors
var featureCitiesBtns = document.querySelector('.city-btns');
var cityWeatherContainerEl = document.querySelector('#city-weather-container');

//Elements in container to display weather info
var weatherResultsContainer = document.querySelector('#weather-container')
var weatherCityNane = document.querySelector('#weather-city-name');
var dateTimeEl = document.querySelector('#date-time');
var weatherIconHeader = document.querySelector('#weather-icon-header');
var weatherDetails = document.querySelector('#weather-details');
var weatherCardSection = document.querySelector('#weather-cards-section');
var cardsHeader = document.querySelector('#cards-header');


//convert city to latitude and longitude
var getLatitudeLongitude = function (city) {
  var geocodeUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + API_key;
  fetch(geocodeUrl)
    .then(function (res) {
      if (res.ok) {
        res.json().then(function (data) {
          //console.log(data);
          var latitude = data[0].lat;
          var longitude = data[0].lon;
          //console.log(latitude, longitude, city);
          getWeatherData(latitude, longitude, city)
        })
      } else {
        alert('City not found');
      }
    })
    .catch(function (error) {
      alert('Unable to connect to the database.');
    });
}

//Get city name from feature city buttons and run getLatitudeLongitude() function
var featureCitiesBtn = function (event) {
  var city = event.target.getAttribute('data-city');
  //console.log(city);

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
  //console.log(city);

  if (city) {
    getLatitudeLongitude(city);
    userCityQueryEl.value = '';
  } else {
    alert('Please enter a valid city');
  };
};

//Get weather data from city's lat and lon from getLatitudeLongitude()
var getWeatherData = function (lat, lon, city) {
  var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=metric&appid=' + API_key;
  console.log(apiUrl);
  fetch(apiUrl)
    .then(function (res) {
      if (res.ok) {
        res.json().then(function (data) {
          console.log(city, data);
          displayWeather(data, city);
          display5DayForecast(data, city);
        })
      } else {
        alert('City not found');
      }
    })
    .catch(function (error) {
      alert('Unable to connect to the database.');
    })
};


//Display weather in the webpage
var displayWeather = function (weather, cityQuery) {
  weatherDetails.textContent = '';
  //Adding city name from query to container
  // weatherResultsContainer.setAttribute('style', 'display:inline;')

  weatherResultsContainer.classList.add('border');
  weatherResultsContainer.classList.add('border-secondary');
  // weatherResultsContainer.classList.add('bg-primary');
  // weatherResultsContainer.classList.add('text-light');

  weatherCityNane.textContent = cityQuery.split('+').join(' ');

  //Adding date and time at the city
  var countryOfCity = weather.city.country;
  var citiesofCountry = moment.tz.zonesForCountry(countryOfCity);
  //console.log(citiesofCountry);

  //Create a for loop to find city and region to get correct time zone
  // for (var i = 0; i < citiesofCountry.length; i++) {
  //   var getregionOfCity = citiesofCountry[i].city;
  //   console.log(getregionOfCity);
  // };

  var getRegionOfCity = citiesofCountry[0].split('/');
  region = getRegionOfCity[0];
  //console.log(region);

  splitCityProvince = cityQuery.split(',');
  //console.log(splitCityProvince);

  cityFormat = splitCityProvince[0].split('+').join('_');
  //console.log(cityFormat);

  moment.tz.setDefault('America/Toronto');
  var dateTime = moment().tz(region + '/' + cityFormat).format("ddd, MMM D YYYY, HH:mm");
  //console.log('Time: ' + dateTime);
  dateTimeEl.textContent = dateTime;

  //Weather icon
  var iconCode = weather.list[0].weather[0].icon
  weatherIconHeader.setAttribute('src', 'http://openweathermap.org/img/wn/' + iconCode + '@2x.png')

  //Adding current temp, wind and humidity
  var cityTemp = weather.list[0].main.temp;
  var tempEl = document.createElement("li");
  tempEl.innerHTML = 'Temp: ' + cityTemp + '°C'

  var cityWind = weather.list[0].wind.speed;
  var windEl = document.createElement("li");
  windEl.innerHTML = 'Wind: ' + cityWind + ' KPH'

  var cityHumidity = weather.list[0].main.humidity;
  var humidityEl = document.createElement("li");
  humidityEl.innerHTML = 'Humidity: ' + cityHumidity + '%'
  //console.log(cityTemp, cityWind, cityHumidity);

  weatherDetails.appendChild(tempEl);
  weatherDetails.appendChild(windEl);
  weatherDetails.appendChild(humidityEl);
};

//Display the 5-day forecast
var display5DayForecast = function (weather, city) {
  weatherCardSection.textContent = '';
  weatherCardSection.className = 'row d-inline'

  var weatherCardsHeader = document.createElement('h5');
  weatherCardsHeader.className = 'col-sm-8 col-md-12';
  weatherCardsHeader.setAttribute('id', 'cards-header');
  weatherCardsHeader.textContent = '5-Day Forecast';
  weatherCardSection.appendChild(weatherCardsHeader);

  var weatherCardsTopDiv = document.createElement('div');
  weatherCardsTopDiv.className = 'row';
  weatherCardSection.appendChild(weatherCardsTopDiv);


  for (var i = 7; i < weather.list.length; i += 8) {
    var create5DayCards = document.createElement('div');
    create5DayCards.setAttribute('id', 'card-body');
    create5DayCards.className = 'card m-1 col-sm-6 col-md-3 col-lg border border-0';
    weatherCardsTopDiv.appendChild(create5DayCards);

    var fiveDaysDate = moment().add((i * 3), 'h').format("ddd, MMM D YYYY");
    //console.log(fiveDaysDate);

    var cardDate = document.createElement('h6');
    cardDate.className = 'card-title';
    cardDate.textContent = fiveDaysDate;
    create5DayCards.appendChild(cardDate);

    //Adding the weather icon
    var iconCode = weather.list[i].weather[0].icon
    //console.log(iconCode);
    var cardIcon = document.createElement('img');
    cardIcon.setAttribute('src', 'http://openweathermap.org/img/wn/' + iconCode + '@2x.png');
    cardIcon.className = 'mx-auto';
    create5DayCards.appendChild(cardIcon);

    var cardUl = document.createElement('ul');
    cardUl.className = 'card-text';
    create5DayCards.appendChild(cardUl);

    //Getting weather data from API data
    var cardTempLi = document.createElement('li');
    var temp = weather.list[i].main.temp;
    cardTempLi.innerHTML = 'Temp: ' + temp + '°C';

    var cardWindLi = document.createElement('li');
    var wind = weather.list[i].wind.speed;
    cardWindLi.innerHTML = 'Wind: ' + wind + ' KPH'

    var cardHumidityLi = document.createElement('li');
    var humidity = weather.list[i].main.humidity;
    cardHumidityLi.innerHTML = 'Humidity: ' + humidity + '%'

    cardUl.appendChild(cardTempLi);
    cardUl.appendChild(cardWindLi);
    cardUl.appendChild(cardHumidityLi);
  };
};

//Event listeners to run the queries
userFormEl.addEventListener('submit', formSubmit);
featureCitiesBtns.addEventListener('click', featureCitiesBtn);