let locationDisplayP = document.getElementById("current-location")

locationDisplayP.style.visibility = "hidden"

var socketio = io("http://localhost:3000")
socketio.on("connect", function() {
	console.log("Socket connected.")
	useHUDColor()
})
socketio.on("disconnect", function() {
	console.log("Disconnected.")
})
socketio.on("new-data", function(payload) {
	let data = JSON.parse(payload)
	
	updateLocationDisplay(data)
})

async function fetchLocationInfo() {
	// Fetch API, see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
	fetch("/api").then(function(response) {
		return response.json()
	}).then(function(data) {
		updateLocationDisplay(data)
	})
}

function updateLocationDisplay(data) {
	console.log("Updating location:", data)
	
	locationDisplayP.style.visibility = ""
	let systemDisplay = document.getElementById("current-system")
	let stationDisplay = document.getElementById("current-station")
	let stationSpan = document.getElementById("current-station-span") // to show or hide it
	let undockedSpan = document.getElementById("undocked-span")
	
	let system = data.system
	if (system == null) {
		system = "Unknown"
	}
	
	systemDisplay.textContent = system
	if (data.station == null) {
		stationSpan.style.display = "none"
		undockedSpan.style.display = ""
	} else {
		stationSpan.style.display = ""
		undockedSpan.style.display = "none"
		stationDisplay.textContent = data.station
	}
}

fetchLocationInfo()
