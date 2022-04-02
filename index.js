//Feature 1 - Display current date and time
let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];
let hour = now.getHours();
let minute = now.getMinutes();
let currentDateTime = document.querySelector("#current-date-time");
currentDateTime.innerHTML = `${day} ${hour}:${minute}`;

function formatDay(timestamp){
	let date = new Date(timestamp * 1000);
	let day = date.getDay();
	let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
	
	return days[day]; 
	
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2 text-center">
                    <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
                      <img src="http://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png" alt="" width="42">
                        <div class="weather-forecast-temperatures">
                        <span class="weather-forecast-temperature-max">
                            ${Math.round(forecastDay.temp.max)}° </span>
                        <span class="weather-forecast-temperature-min">
                            ${Math.round(forecastDay.temp.min)}° </span>
                    </div>
        </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
//Feature 2 - Add a search engine, when searching for a city (i.e. Paris), display the city name on the page after the user submits the form.
function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-text-input");
  console.log(searchInput.value);
  let currentCity = document.querySelector("#current-city");

  if (searchInput.value) {
    currentCity.innerHTML = `${searchInput.value}`;
  } else {
    currentCity.innerHTML = null;
    alert("Please type a city");
  }
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", search);

function getForecast(coordinates){
	let apiKey = "b4fab91a7d6133de7679f7f59687699f";
	let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
	console.log(apiUrl);
	axios.get(apiUrl).then(displayForecast);
}

function displayWeather(response) {
  console.log(response.data);
  document.querySelector("#current-city").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = `${Math.round(
    response.data.main.temp
  )}`;
  document.querySelector("#weather-today").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  celsiusTemperature = response.data.main.temp;
	
	getForecast(response.data.coord);
}

function searchForCity(event) {
  event.preventDefault();
  let apiKey = "b4fab91a7d6133de7679f7f59687699f";
  let searchInput = document.querySelector("#search-text-input");
  let city = searchInput.value;
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayWeather);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchForCity);

function displayCurrentCity(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(handlePosition);
}

function handlePosition(position) {
  let apiKey = "b4fab91a7d6133de7679f7f59687699f";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let units = "metric";
  let locationUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;

  axios.get(locationUrl).then(displayWeather);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let button = document.querySelector("button");
button.addEventListener("click", displayCurrentCity);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);


