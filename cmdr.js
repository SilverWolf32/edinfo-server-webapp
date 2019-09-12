let cmdrSidebar = document.getElementById("cmdr-details")

socketio.on("update-cmdr", function(payload) {
	let data = JSON.parse(payload)
	
	updateCMDRDetails(data)
})

async function fetchCMDRInfo() {
	// Fetch API, see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
	fetch("/api/cmdrinfo").then(function(response) {
		return response.json()
	}).then(function(data) {
		updateCMDRDetails(data)
	})
	fetch("/api/shipinfo").then(function(response) {
		return response.json()
	}).then(function(data) {
		updateShipDetails(data)
	})
}

function updateCMDRDetails(data) {
	console.log("Updating CMDR details:", data)
	
	let nameDisplay = document.getElementById("cmdr-name")
	
	let name = data.cmdr.cmdrName
	if (name == null) {
		name = "Unknown"
	}
	
	nameDisplay.textContent = "CMDR " + name
	nameDisplay.style.display = "block"
}
function updateShipDetails(data) {
	console.log("Updating ship details:", data)
	
	let nameDisplay = document.getElementById("ship-name")
	
	let name = data.name
	if (name == null) {
		name = "Unknown"
	}
	
	nameDisplay.textContent = name
	nameDisplay.style.display = "block"
}

fetchCMDRInfo()
