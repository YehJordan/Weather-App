import React, { useState } from 'react';
import './style.css'; 

const WeatherApp = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [error, setError] = useState('');

    const getWeather = () => {
        const apiKey = process.env.REACT_APP_WEATHER_API_KEY; // API key

        if (!city) {
            alert('Please enter a city');
            return;
        }

        const currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

        fetch(currentWeather)
            .then(response => response.json())
            .then(data => {
                if (data.cod === '404') {
                    setError(data.message);
                } else {
                    setError('');
                    setWeather({
                        cityName: data.name,
                        temperature: Math.round(data.main.temp - 273.15),
                        description: data.weather[0].description,
                        icon: data.weather[0].icon
                    });
                }
            })
            .catch(error => {
                console.log('Error getting weather', error);
                alert('Error getting current weather. Please try again!');
            });

        fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                setForecast(data.list.slice(0, 8)); // Take 8 items for the next 24 hours
            })
            .catch(error => {
                console.log('Error getting forecast', error);
                alert('Error getting current forecast. Please try again!');
            });
    };

    return (
        <div id="content">
            <h1 id="title">Yeh's Weather App</h1>
            
            {error && <p>{error}</p>}

            {weather && (
                <>
                    <img
                        id="image"
                        src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
                        alt={weather.description}
                    />
                    <div id="temperature">{weather.temperature}°C</div>
                    <div id="information">
                        <p>{weather.cityName}</p>
                        <p>{weather.description}</p>
                    </div>
                </>
            )}

            <div id="forecast">
                {forecast.map((item, index) => {
                    const dateTime = new Date(item.dt * 1000);
                    const hour = dateTime.getHours();
                    const temp = Math.round(item.main.temp - 273.15);
                    const icon = item.weather[0].icon;
                    return (
                        <div key={index} className="hourly-item">
                            <span>{hour}:00</span>
                            <img src={`https://openweathermap.org/img/wn/${icon}.png`} alt="weather icon" />
                            <span>{temp}°C</span>
                        </div>
                    );
                })}
            </div>

            <input
                type="text"
                id="citySearch"
                placeholder="Enter your city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />
            <button id="cityButton" onClick={getWeather}>Search</button>
        </div>
    );
};

export default WeatherApp;
