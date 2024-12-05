/* OpenWeather API */
const apiKey = 'd41008436125765f1e2f7f7837718053'; 
const searchHistory = [];

function displaySearchHistory() {
    const searchHistoryList = document.getElementById('search-history-list');
    searchHistoryList.innerHTML = ''; /* Clears previous list */

    for (const city of searchHistory) {
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item');
      listItem.textContent = city;
      searchHistoryList.appendChild(listItem);
    }
}
  
async function getWeather() {
    const city = document.getElementById('city-input').value;
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&cnt=40`;

    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
    }

    try {
        const weatherResponse = await fetch(weatherApiUrl);
        const weatherData = await weatherResponse.json();

        /* Retrieve data from API */
        const cityName = weatherData.name;
        const country = weatherData.sys.country;
        
        const tempCelsius = weatherData.main.temp;
        const tempFahrenheit = (tempCelsius * 9/5) + 32;
        
        const weatherDesc = weatherData.weather[0].description;
        const iconUrl = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
        
        const windSpeed = weatherData.wind.speed;
        const humidity = weatherData.main.humidity;

        /* Retrieve 5-day forecast */
        const forecastResponse = await fetch(forecastApiUrl);
        const forecastData = await forecastResponse.json();

        let forecastHtml = '';

        for (let i = 0; i < 5; i++) {
            const forecast = forecastData.list[i * 8]; 
            const date = new Date(forecast.dt * 1000); 

            const day = date.toLocaleDateString('en-US', { weekday: 'long' });
            const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

            const forecastDesc = forecast.weather[0].description;

            const highTemp = forecast.main.temp_max;
            const lowTemp = forecast.main.temp_min;
            const iconUrlForecast = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

            if (i % 5 === 0) {
                if (i !== 0) {
                    forecastHtml += '</div>'; /* Closes the previous row */
                }
                forecastHtml += '<div class="row g-2 justify-content-center mb-5">'; /* Opens a new row */
            }

            forecastHtml += `<div class="col-xl-2 col-lg-4 col-md-6 col-12 my-3">
                                <div class="forecast-day mt-2 mb-3 h-100 shadow-sm">
                                    <div class="sc-container-heading">
                                        <h4 class="fw-bold">DAY ${i + 1}</h4>
                                    </div>
                                    <div class="sc-container-content p-4">
                                        <img class="rounded-circle shadow mx-auto d-block mb-3 bg-secondary" src="${iconUrlForecast}" alt="Weather Icon" />
                                        <h6 class="text-center"><span class="badge badge-desc rounded-pill text-bg-warning px-3 text-uppercase text-truncate"> ${forecastDesc} </span></h6>
                                        <hr>
                                        <h5 class="fw-bold"><i class="fas fa-calendar-day"></i>&nbsp; ${day}</h5>
                                        <h6>${formattedDate}</h6>

                                        <div class="sc-temp-content rounded-2 py-1 mt-3">
                                            <h6><span class="badge rounded-pill text-bg-light px-3"> TEMPERATURE</span></h6>
                                            <h6><i class="far fa-temperature-high fa-fw"></i> Hi: ${highTemp}°C </h6>
                                            <h6><i class="far fa-temperature-low fa-fw"></i> Low: ${lowTemp}°C</h6>
                                        </div>
                                    </div>

                                </div>
                            </div>
            `;
        }

        /* Closes the last row */
        forecastHtml += '</div>';
        
        /* Display data */
        document.getElementById('sc-weather-info').innerHTML = `
            <div class="forecast-city mt-2 mb-3 h-100 shadow-sm">
                <div class="sc-container-heading">
                    <h6 class="fw-bold">Weather details for "${cityName}"</h6>
                </div>
                <div class="sc-container-content p-5">
                    <div class="row">
                        <div class="col-lg-4 col-md-6 col-12">
                            <img class="rounded-circle shadow mx-auto d-block my-5 w-50 bg-secondary" src="${iconUrl}" alt="Weather Icon" width="100%" />
                        </div>
                        <div class="col-lg-8 col-md-6 col-12">
                            <h2 class="fw-bold"><i class="fas fa-map-marker-alt"></i>&nbsp; ${cityName}, ${country}</h2><hr>
                            <h6><span class="badge rounded-pill text-bg-light px-3"> OVERVIEW</span></h6>
                            <h6><i class="fas fa-cloud fa-fw"></i>&nbsp; Weather: <span class="text-uppercase">${weatherDesc}</span></h6>
                            <h6><i class="fas fa-wind fa-fw"></i>&nbsp; Wind Speed: ${windSpeed}</h6>
                            <h6><i class="fas fa-humidity fa-fw"></i>&nbsp; Humidity: ${humidity}</h6>
                            <hr><h6><span class="badge rounded-pill text-bg-light px-3"> TEMPERATURE</span></h6>
                            <h6><i class="fas fa-thermometer-quarter fa-fw"></i>&nbsp; In Celsius: ${tempCelsius}°C, In Fahrenheit: ${tempFahrenheit}°F</h6>
                        </div>
                    </div>
                </div>

            </div>

            <h2 class="fw-semibold text-center mt-4"> 5-Day Forecast for ${cityName}: </h2>
            ${forecastHtml}
        `;

    } catch (error) {
        console.error('Error fetching weather data:', error);
        const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        errorModal.show();
    }
    displaySearchHistory();
}


