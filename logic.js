const apiKey = "501a853f60064c20b5893147251607";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const locationElem = document.getElementById("location");
const tempElem = document.getElementById("temp");
const iconElem = document.getElementById("icon");
const conditionElem = document.getElementById("condition");
const detailsElem = document.querySelector(".details");
const forecastGrid = document.getElementById("forecastGrid");

// Fetch weather data
function getWeather(query) {
  fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=1&aqi=no&alerts=no`)
    .then(res => res.json())
    .then(data => {
      // Update current weather
      locationElem.textContent = `${data.location.name}, ${data.location.region}`;
      tempElem.textContent = `${data.current.temp_c}°C`;
      iconElem.src = `https:${data.current.condition.icon}`;
      conditionElem.textContent = data.current.condition.text;

      // Extra info
      detailsElem.innerHTML = `
        <p>Humidity: ${data.current.humidity}%</p>
        <p>Wind: ${data.current.wind_kph} km/h</p>
        <p>Feels Like: ${data.current.feelslike_c}°C</p>
      `;

      // Forecast
      forecastGrid.innerHTML = "";
      data.forecast.forecastday[0].hour.forEach(hour => {
        const div = document.createElement("div");
        div.className = "forecast-card";
        div.innerHTML = `
          <p>${hour.time.split(" ")[1]}</p>
          <img src="https:${hour.condition.icon}" alt="" />
          <p>${hour.temp_c}°C</p>
        `;
        forecastGrid.appendChild(div);
      });

      // Background logic
      const condition = data.current.condition.text.toLowerCase();
      const isNight = data.current.is_day === 0;
      document.body.className = "";
      if (isNight) {
        document.body.classList.add("weather-night");
      } else if (condition.includes("sun") || condition.includes("clear")) {
        document.body.classList.add("weather-clear");
      } else if (condition.includes("partly cloudy")) {
        document.body.classList.add("weather-cloudy");
      } else if (condition.includes("rainy") || condition.includes("drizzle")) {
        document.body.classList.add("weather-rain");
      } else if (condition.includes("snow")) {
        document.body.classList.add("weather-snow");
      } else if (condition.includes("thunder")) {
        document.body.classList.add("weather-thunder");
      } else if (condition.includes("fog") || condition.includes("mist") || condition.includes("haze")) {
        document.body.classList.add("weather-fog");
      } else if (condition.includes("wind")) {
        document.body.classList.add("weather-windy");
      } else {
        document.body.classList.add("weather-default");
      }
    })
    .catch(() => alert("Could not fetch weather data."));
}

// Detect location on load
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        getWeather(`${lat},${lon}`);
      },
      () => {
        getWeather("New York");
      }
    );
  } else {
    getWeather("New York");
  }
};

// Search functionality
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query !== "") getWeather(query);
});
