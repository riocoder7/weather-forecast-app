import { weatherApiKey } from './apikey.js';

const apiKey = weatherApiKey;
const searchInput = document.querySelector(".searchinput");
const suggestionsContainer = document.querySelector(".suggestions");

document.addEventListener("DOMContentLoaded", () => {
    if (!searchInput) {
        console.error("Search input not found");
        return;
    }

    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            const city = searchInput.value.trim();
            if (city) {
                search(city);
                suggestionsContainer.innerHTML = ""; // Clear suggestions
            }
        }
    });

    searchInput.addEventListener("input", async function () {
        const query = searchInput.value.trim();
        if (query.length < 3) {
            suggestionsContainer.innerHTML = "";
            return;
        }
        await fetchSuggestions(query);
    });
});

// Fetch weather data
async function search(city) {
    try {
        console.log(`Searching for: ${city}`); // Debugging log
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`);

        if (!response.ok) {
            throw new Error(`City not found: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Weather Data:", data); // Debugging log

        if (!data.weather || data.weather.length === 0) {
            throw new Error("Weather data is missing in API response");
        }

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

        const weatherCondition = data.weather[0].main;
        document.querySelector(".weather-img").src = weatherIcons[weatherCondition] || "img/default.png";

    } catch (error) {
        console.error("Error fetching weather data:", error);
        document.querySelector(".return").style.display = "none";
        document.querySelector(".message").style.display = "none";
        document.querySelector(".error-message").style.display = "block";
    }
}

// Fetch city suggestions
async function fetchSuggestions(query) {
    try {
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${apiKey}`);
        const data = await response.json();

        if (!data || data.length === 0) {
            suggestionsContainer.innerHTML = "";
            return;
        }

        suggestionsContainer.innerHTML = data
            .map(city => `<div class="suggestion-item" data-city="${city.name}, ${city.country}">${city.name}, ${city.country}</div>`)
            .join("");

        document.querySelectorAll(".suggestion-item").forEach(item => {
            item.addEventListener("click", function () {
                searchInput.value = this.dataset.city;
                search(this.dataset.city);
                suggestionsContainer.innerHTML = "";
            });
        });
    } catch (error) {
        console.error("Error fetching city suggestions:", error);
    }
}
