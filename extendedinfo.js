var nearbyStations = null

async function updateExtendedInfo() {
	// ask server to get nearby stations
	console.log("Getting nearby station information")
	
	let table = document.getElementById("extendedinfo-table")
	
	// tell the user what's happening
	{
		while (table.hasChildNodes()) {
			table.removeChild(table.firstChild)
		}
		let tr = document.createElement("tr")
		let td = document.createElement("td")
		td.textContent = "Fetching..."
		tr.appendChild(td)
		table.appendChild(tr)
	}
	
	let radiusBox = document.getElementById("radius-input")
	console.log("Radius input box:", radiusBox)
	let radius = radiusBox.valueAsNumber
	console.log("Provided radius:", radius)
	if (radius == null) {
		radius = 30
	}
	
	fetch("/api/nearby-stations?r=" + radius + "&clientID=" + socketio.id)
	.then(function(response) {
		if (response.status != 200) {
			// it's an error
			return Promise.reject(response)
		}
		return response.json()
	})
	.then(function(stations) {
		nearbyStations = stations
		populateTable()
	})
	.catch(function(response) {
		console.log(response)
		
		response.json().then(function(error) {
			while (table.hasChildNodes()) {
				table.removeChild(table.firstChild)
			}
			{
				let thead = document.createElement("thead")
				let tr = document.createElement("tr")
				let td = document.createElement("td")
				let div = document.createElement("div")
				div.textContent = response.statusText
				td.appendChild(div)
				tr.appendChild(td)
				thead.appendChild(tr)
				table.appendChild(thead)
			}
			{
				let tbody = document.createElement("tbody")
				let tr = document.createElement("tr")
				let td = document.createElement("td")
				td.textContent = error.message
				// td.textContent = JSON.stringify(error, null, "\t")
				td.classList.add("monospace")
				tr.appendChild(td)
				tbody.appendChild(tr)
				table.appendChild(tbody)
			}
			// debugger
		})
	})
}
function populateTable() {
	let stations = nearbyStations
	
	if (stations == null) {
		// no stations to add
		return
	}
	
	stations = filterStations(stations)
	
	console.log("Stations:", stations)
	
	let table = document.getElementById("extendedinfo-table")
	
	// remove all columns
	while (table.hasChildNodes()) {
		table.removeChild(table.firstChild)
	}
	
	// add rows
	let properties = ["type", "name", "systemName", "distanceToArrival", "distance"]
	
	let selectedType = document.querySelector('input[name="filter-selector"]:checked').value
	if (selectedType === "materialTrader") {
		properties = ["type", "mttype", "name", "systemName", "distanceToArrival", "distance"]
	}
	
	let thead = document.createElement("thead")
	// add headers
	for (let i = 0; i < properties.length; i++) {
		let property = properties[i]
		let displayName = unCamelCase(property)
		
		if (property == "type") {
			displayName = "Pad"
		}
		if (property == "mttype" || property == "techtype") {
			displayName = "Type"
		}
		
		let cell = document.createElement("td")
		// div to contain the text, that way we can set a margin on it
		let div = document.createElement("div")
		div.textContent = displayName
		cell.appendChild(div)
		thead.appendChild(cell)
	}
	table.appendChild(thead)
	
	let tbody = document.createElement("tbody")
	for (let i = 0; i < stations.length; i++) {
		let station = stations[i]
		let row = document.createElement("tr")
		for (let j = 0; j < properties.length; j++) {
			let property = properties[j]
			let cell = document.createElement("td")
			
			let text = station[property]
			if (text == Number(text)) {
				text = Math.round(text)
			}
			if (property == "type") {
				// outposts are currently the only stations with only S/M pads
				text = "L"
				if (station[property] === "Outpost" || station[property] === "Planetary Outpost") {
					text = "M"
				}
				cell.classList.add("monospace")
			}
			if (property == "mttype") {
				let mttype = "??"
				// see https://elite-dangerous.fandom.com/wiki/Material_Trader
				switch (station["economy"]) {
					case "Refinery":
						mttype = "Raw"
						break
					case "Extraction":
						mttype = "Raw/Manufactured"
						break
					case "Industrial":
						mttype = "Manufactured"
						break
					case "High Tech":
					case "Military":
						mttype = "Encoded"
						break
				}
				if (station["secondEconomy"] != null) {
					console.log("Second economy for " + station["name"] + ": " + station["secondEconomy"])
					mttype += "?"
				}
				text = mttype
				cell.classList.add("monospace")
			}
			cell.textContent = text
			
			if (property == "distance") {
				cell.textContent += " Ly"
				cell.style.textTransform = "none"
				cell.classList.add("monospace")
			}
			if (property == "distanceToArrival") {
				cell.textContent += " Ls"
				cell.style.textTransform = "none"
				cell.classList.add("monospace")
			}
			
			row.appendChild(cell)
		}
		tbody.appendChild(row)
	}
	table.appendChild(tbody)
}

// updateExtendedInfo()

function filterStations(stations) {
	// see https://stackoverflow.com/a/15839451
	let selectedType = document.querySelector('input[name="filter-selector"]:checked').value
	console.log("Filtering stations for " + unCamelCase(selectedType).toLowerCase())
	stations = stations.filter((station) => {
		switch (selectedType) {
			case "fuel":
				return station.otherServices.includes("Refuel")
				break
			case "repair":
				return station.otherServices.includes("Repair")
				break
			case "restock":
				return station.otherServices.includes("Restock")
				break
			case "interstellarFactors":
				return station.otherServices.includes("Interstellar Factors Contact")
				break
			case "materialTrader":
				return station.otherServices.includes("Material Trader")
				break
			case "techBroker":
				return station.otherServices.includes("Technology Broker")
				break
		}
		return false
	})
	console.log(stations.length + " results")
	return stations
}
// make selector filter the stations
{
	let radios = document.querySelectorAll('input[name="filter-selector"]')
	for (let i = 0; i < radios.length; i++) {
		radios[i].addEventListener("click", populateTable)
	}
}

function unCamelCase(s) {
	return (s.toUpperCase()[0] + s.slice(1).replace(/([A-Z])/g, " $1"))
		// Got any more things that shouldn't be capitalized? Put them here!
		.replace(/ (To|The|And|A|An|Of|On) /, (word) => word.toLowerCase())
}
