window.addEventListener("DOMContentLoaded", () => {
	const locationEl = document.querySelector(".location");
	const tempEl = document.getElementById("temperature");
	const descEl = document.getElementById("description");
	const iconEl = document.getElementById("weather-icon");
	const toggleBtn = document.getElementById("toggle-btn");
	const statusEl = document.getElementById("status");

	let weatherData = {};
	let currentUnit = "C";

	if (navigator.geolocation) {
		statusEl.textContent = "Requesting location permission...";
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
	} else {
		statusEl.textContent = "Geolocation is not supported by your browser.";
	}

	function onSuccess(position) {
		const { latitude, longitude } = position.coords;
		statusEl.textContent = "Fetching weather data...";
		fetchWeather(latitude, longitude);
	}

	function onError(error) {
		switch (error.code) {
			case error.PERMISSION_DENIED:
				statusEl.textContent = "User denied the request for Geolocation.";
				break;
			case error.POSITION_UNAVAILABLE:
				statusEl.textContent = "Location information is unavailable.";
				break;
			case error.TIMEOUT:
				statusEl.textContent = "The request to get user location timed out.";
				break;
			default:
				statusEl.textContent = "An unknown error occurred.";
				break;
		}
	}

	async function fetchWeather(lat, lon) {
		const apiUrl = `https://weather-proxy.freecodecamp.rocks/api/current?lat=${lat}&lon=${lon}`;

		try {
			const response = await fetch(apiUrl);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();

			weatherData = {
				city: data.name,
				country: data.sys.country,
				tempC: data.main.temp,
				tempF: (data.main.temp * 9) / 5 + 32,
				description: data.weather[0].description,
				icon: data.weather[0].icon,
			};

			statusEl.textContent = "";
			updateUI();
		} catch (error) {
			statusEl.textContent = `Failed to fetch weather: ${error.message}`;
		}
	}

	function updateUI() {
		if (!weatherData.city) return;

		locationEl.textContent = `${weatherData.city}, ${weatherData.country}`;
		descEl.textContent = weatherData.description;
		iconEl.src = weatherData.icon;
		iconEl.alt = weatherData.description;

		// (User Story 3: Toggle Logic)
		if (currentUnit === "C") {
			tempEl.textContent = `${weatherData.tempC.toFixed(1)} °C`;
		} else {
			tempEl.textContent = `${weatherData.tempF.toFixed(1)} °F`;
		}
	}

	toggleBtn.addEventListener("click", () => {
		if (currentUnit === "C") {
			currentUnit = "F";
		} else {
			currentUnit = "C";
		}
		updateUI();
	});
});
