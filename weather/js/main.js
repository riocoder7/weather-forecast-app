const apiKey = "fbcca56a8bc55fb43602a104df8fa915";

navigator.geolocation.getCurrentPosition(async (position) => {
    try {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Get city name from latitude & longitude
        const mapResponse = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`);
        const locationData = await mapResponse.json();
        if (!locationData.length) throw new Error("Location not found");
        const cityName = locationData[0].name;

        // Fetch weather details
        const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${apiKey}`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();
        if (!weatherData.city) throw new Error("Weather data not available");

        updateWeatherUI(weatherData);
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch weather data. Please try again.");
    }
}, () => {
    alert("Please enable location access and refresh the page.");
});

function updateWeatherUI(data) {
    const currentWeather = data.list[0];
    
    document.getElementById("city-name").textContent = data.city.name;
    document.getElementById("metric").textContent = `${Math.floor(currentWeather.main.temp)}°C`;
    document.getElementById("humidity").textContent = `${currentWeather.main.humidity}%`;
    document.getElementById("feels-like").textContent = `${Math.floor(currentWeather.main.feels_like)}°C`;
    document.getElementById("temp-min-today").textContent = `${Math.floor(currentWeather.main.temp_min)}°C`;
    document.getElementById("temp-max-today").textContent = `${Math.floor(currentWeather.main.temp_max)}°C`;
    
    const weatherCondition = currentWeather.weather[0].main.toLowerCase();
    updateWeatherIcon(weatherCondition, currentWeather.dt);
    displayForecast(data);
}

function updateWeatherIcon(condition, timestamp) {
    const iconMap = {
        rain: "img/rain.png",
        clear: "img/sun.png",
        "clear sky": "img/sun.png",
        snow: "img/snow.png",
        clouds: "img/cloud.png",
        smoke: "img/cloud.png",
        mist: "img/mist.png",
        fog: "img/mist.png",
        haze: "img/haze.png"
    };

    const timeOfDay = getTimeOfDay(timestamp);
    const iconSrc = getIconForTimeOfDay(condition, timeOfDay);

    document.querySelector(".weather-icon").src = iconSrc;
    document.querySelector(".weather-icons").src = iconSrc;
}

function getTimeOfDay(timestamp) {
    // Convert UTC to IST (Indian Standard Time)
    const date = new Date(timestamp * 1000); // Convert Unix timestamp to JavaScript Date
    const hoursInIST = date.getUTCHours() + 5; // IST is UTC + 5 hours

    // Determine time of day
    if (hoursInIST >= 5 && hoursInIST < 12) return "morning";
    if (hoursInIST >= 12 && hoursInIST < 17) return "afternoon";
    if (hoursInIST >= 17 && hoursInIST < 19) return "evening";
    return "night";
}

function getIconForTimeOfDay(condition, timeOfDay) {
    const iconMap = {
        rain: "img/rain.png",
        clear: {
            morning: "img/sun.png",
            afternoon: "img/sun.png",
            evening: "img/evening.png",
            night: "img/cloud-moon-solid.svg"
        },
        "clear sky": {
            morning: "img/sun.png",
            afternoon: "img/temperature-high-solid.svg",
            evening: "img/evening.png",
            night: "img/cloud-moon-solid.svg"
        },
        snow: "img/snow.png",
        clouds: "img/cloud.png",
        smoke: "img/cloud.png",
        mist: "img/mist.png",
        fog: "img/mist.png",
        haze: "img/haze.png"
    };

    if (typeof iconMap[condition] === "string") {
        return iconMap[condition];
    } else {
        return iconMap[condition][timeOfDay] || "img/sun.png";
    }
}

function displayForecast(data) {
    const forecastBox = document.getElementById("forecast-box");
    let dailyForecasts = {};
    let forecastHTML = "";
    
    data.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];
        if (!dailyForecasts[date]) {
            const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "short" });
            dailyForecasts[date] = {
                day: dayName,
                temp: Math.floor(item.main.temp) + "°C",
                condition: item.weather[0].main.toLowerCase(),
                timestamp: item.dt
            };
        }
    });

    for (const date in dailyForecasts) {
        const { day, temp, condition, timestamp } = dailyForecasts[date];
        const timeOfDay = getTimeOfDay(timestamp);
        const imgSrc = getIconForTimeOfDay(condition, timeOfDay);

        forecastHTML += `
            <div class="weather-forecast-box">
                <div class="day-weather"><span>${day}</span></div>
                <div class="weather-icon-forecast"><img src="${imgSrc}" /></div>
                <div class="temp-weather"><span>${temp}</span></div>
            </div>
        `;
    }
    forecastBox.innerHTML = forecastHTML;
}
