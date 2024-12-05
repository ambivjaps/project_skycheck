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
                forecastHtml += '<div class="row">'; /* Opens a new row */
            }

            forecastHtml += `<div class="col-md-2">
                                <div class="forecast-day">
                                    <h5>${day}</h5>
                                    <h5>${formattedDate}</h5>
                                    <img src="${iconUrlForecast}" alt="Weather Icon" />
                                    <p>Hi: ${highTemp}°C, Low: ${lowTemp}°C</p>
                                </div>
                            </div>
            `;
        }

        /* Closes the last row */
        forecastHtml += '</div>';
        
        /* Display data */
        document.getElementById('sc-weather-info').innerHTML = `
            <h3>${cityName}, ${country}</h3>
            <h4>Temperature:</h4>
            <h5>In Celsius: ${tempCelsius}°C, In Fahrenheit: ${tempFahrenheit}°F</h5>
            <h5>Weather: ${weatherDesc}</h5>
            <h5>Wind Speed: ${windSpeed}</h5>
            <h5>Humidity: ${humidity}</h5>
            <img src="${iconUrl}" alt="Weather Icon" />
            <hr>
            <h4> 5-Day Forecast: </h4>
            ${forecastHtml}
        `;

    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('sc-weather-info').innerHTML = '<div class="alert alert-danger" role="alert"> Error fetching weather data. Please try again! </div>';
    }
}