import {weatherApiKey} from './apikey.js';

const apiKey = weatherApiKey;
const searchInput = document.querySelector(".searchinput");
const box = document.querySelector(".box");
const normalMessage = document.querySelector(".normal-message");
const errorMessage = document.querySelector(".error-message");
const addedMessage = document.querySelector(".added-message");
const section = document.querySelector(".add-section");
const navBtn = document.querySelector(".button");
const navIcon = document.querySelector(".btn-icon");

// Set Date
const dateElement = document.querySelector(".date");
const today = new Date();
const monthsName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
dateElement.textContent = `${monthsName[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

// Weather info
async function fetchWeather(cityName) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`);
        if (!response.ok) throw new Error("City not found");
        const data = await response.json();

        return {
            name: data.name,
            temp: Math.floor(data.main.temp) + "°C",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            weather: data.weather[0].main
        };
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}

function addCityToDOM(cityData) {
    if (!cityData) return;

    const weatherBox = document.createElement("div");
    weatherBox.className = "weather-box";

    const nameDiv = document.createElement("div");
    nameDiv.className = "name";
    nameDiv.innerHTML = `<div class="city-name city">${cityData.name}</div>
                         <div class="weather-temp temp">${cityData.temp}</div>
                         <div class="time">${cityData.time}</div>`;

    const weatherIconDiv = document.createElement("div");
    weatherIconDiv.className = "weather-icon";
    const weatherImg = document.createElement("img");
    weatherImg.className = "weather";

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
    weatherImg.src = weatherIcons[cityData.weather] || "img/sun.png";

    weatherIconDiv.appendChild(weatherImg);
    weatherBox.appendChild(nameDiv);
    weatherBox.appendChild(weatherIconDiv);
    box.prepend(weatherBox);
}

// Toggle section visibility
navBtn.addEventListener("click", () => {
    if (section.style.top === "-60rem") {
        section.style.top = "100px";
        navIcon.className = "fa-solid fa-circle-xmark";
    } 
    else {
        section.style.top = "-60rem";
        navIcon.className = "fa-solid fa-circle-plus";
    }
});

// Search functionality
searchInput.addEventListener("keydown", async function (event) {
    if (event.key === "Enter") {
        const cityData = await fetchWeather(searchInput.value.trim());
        addCityToDOM(cityData);

        if (cityData) {
            normalMessage.style.display = "none";
            errorMessage.style.display = "none";
            addedMessage.style.display = "block";
            
        } else {
            normalMessage.style.display = "none";
            errorMessage.style.display = "block";
            addedMessage.style.display = "none";
            
        }
        // document.querySelector(".add-section").style.display = "none";
    }
    
});

// Load available cities from API
async function loadAvailableCities() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/find?lat=0&lon=0&cnt=10&appid=${apiKey}`);
        if (!response.ok) throw new Error("Failed to fetch cities");
        const data = await response.json();
        const cityList = data.list.map(city => city.name);
        
        for (const city of cityList) {
            const cityData = await fetchWeather(city);
            addCityToDOM(cityData);
        }
    } catch (error) {
        console.error("Error fetching available cities:", error);
    }
}

loadAvailableCities();
