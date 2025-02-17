import {weatherApiKey} from './apikey.js';

const apiKey = weatherApiKey;
const searchInput = document.querySelector(".searchinput");

async function search(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        
        if (!response.ok) throw new Error("City not found");
        
        const data = await response.json();
        console.log(data);
        
        document.querySelector(".return").style.display = "block";
        document.querySelector(".message").style.display = "none";
        document.querySelector(".error-message").style.display = "none";

        document.querySelector(".city-name").textContent = data.name;
        document.querySelector(".weather-temp").textContent = `${Math.floor(data.main.temp)}°C`;
        document.querySelector(".wind").textContent = `${Math.floor(data.wind.speed)} m/s`;
        document.querySelector(".pressure").textContent = `${Math.floor(data.main.pressure)} hPa`;
        document.querySelector(".humidity").textContent = `${Math.floor(data.main.humidity)}%`;
        document.querySelector(".sunrise").textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        document.querySelector(".sunset").textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        const weatherIcons = {
            Rain: "img/rain.png",
            Clear: "img/sun.png",
            Snow: "img/snow.png",
            Clouds: "img/cloud.png",
            Smoke: "img/cloud.png",
            Mist: "img/mist.png",
            Fog: "img/mist.png",
            Haze: "img/haze.png"
        };

        document.querySelector(".weather-img").src = weatherIcons[data.weather[0].main] || "img/sun.png";
    } catch (error) {
        console.error("Error fetching weather data:", error);
        document.querySelector(".return").style.display = "none";
        document.querySelector(".message").style.display = "none";
        document.querySelector(".error-message").style.display = "block";
    }
}

searchInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        search(searchInput.value.trim());
    }
});
