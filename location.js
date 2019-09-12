let locationDisplayP = document.getElementById("current-location")

locationDisplayP.style.visibility = "hidden"

{
	let undockedSpan = document.getElementById("undocked-span")
	undockedSpan.textContent = "Undocked" // undo the no-JS warning in the HTML
}

var socketio = io("/")
socketio.on("connect", function() {
	console.log("Socket connected.")
	let socketsWarning = document.getElementById("sockets-warning")
	socketsWarning.style.visibility = "hidden";
	socketsWarning.style.opacity = "0";
})
socketio.on("disconnect", function() {
	console.log("Disconnected.")
	let socketWarning = document.getElementById("sockets-warning")
	socketWarning.style.visibility = ""
	socketWarning.style.opacity = ""
})
socketio.on("update-location", function(payload) {
	let data = JSON.parse(payload)
	
	updateLocationDisplay(data)
})

async function fetchLocationInfo() {
	// Fetch API, see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
	fetch("/api/location").then(function(response) {
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
