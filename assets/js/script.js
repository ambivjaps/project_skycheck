/* OpenWeather API */
const apiKey = 'd41008436125765f1e2f7f7837718053'; 

async function getWeather() {
    const city = document.getElementById('city-input').value;
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&cnt=40`;

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

            const highTemp = forecast.main.temp_max;
            const lowTemp = forecast.main.temp_min;
            const iconUrlForecast = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

            if (i % 5 === 0) {
                if (i !== 0) {
                    forecastHtml += '</div>'; /* Closes the previous row */
                }
                forecastHtml += '<div class="row justify-content-center">'; /* Opens a new row */
            }

            forecastHtml += `<div class="col-xl-2 col-lg-6 col-md-6 col-12 my-3">
                                <div class="forecast-day mt-2 mb-3 bg-body-tertiary rounded-4 h-100 shadow-sm">
                                    <div class="sc-container-heading">
                                        <h6 class="fw-bold">Day#${i + 1}</h6>
                                    </div>
                                    <div class="sc-container-content p-4">
                                        <h5 class="fw-bold"><i class="fas fa-calendar-day"></i>&nbsp; ${day}</h5>
                                        <h6>${formattedDate}</h6>
                                        <img class="rounded-circle shadow mx-auto d-block my-3" src="${iconUrlForecast}" alt="Weather Icon" />
                                        <h5 class="text-center"><span class="badge rounded-pill text-bg-dark px-3"> RAINY </span></h5><hr>
                                        <div class="sc-temp-content">
                                            <h6><span class="badge rounded-pill text-bg-dark px-3"> TEMPERATURE</span></h6>
                                            <h6><i class="far fa-temperature-high"></i> Hi: ${highTemp}°C </h6>
                                            <h6><i class="far fa-temperature-low"></i> Low: ${lowTemp}°C</h6>
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
            <div class="forecast-city mt-2 mb-3 bg-body-tertiary rounded-4 h-100 shadow-sm">
                <div class="sc-container-heading">
                    <h6 class="fw-bold">Weather details for "${cityName}"</h6>
                </div>
                <div class="sc-container-content p-4">
                    <div class="row">
                        <div class="col-md-6">
                            <img class="rounded-circle shadow" src="${iconUrl}" alt="Weather Icon" />
                        </div>
                        <div class="col-md-6">
                            <h3 class="fw-bold">${cityName}, ${country}</h3><hr>
                            <h6><span class="badge rounded-pill text-bg-dark px-3"> OVERVIEW</span></h6>
                            <h6>Weather: ${weatherDesc}</h6>
                            <h6>Wind Speed: ${windSpeed}</h6>
                            <h6>Humidity: ${humidity}</h6>
                            <hr><h6><span class="badge rounded-pill text-bg-dark px-3"> TEMPERATURE</span></h6>
                            <h6>In Celsius: ${tempCelsius}°C, In Fahrenheit: ${tempFahrenheit}°F</h6>
                        </div>
                    </div>
                </div>

            </div>

            <hr><h2 class="fw-bold text-center"> 5-Day Forecast: </h2>
            ${forecastHtml}
        `;

    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('sc-weather-info').innerHTML = '<div class="alert alert-danger" role="alert"> Error fetching weather data. Please try again! </div>';
    }
}